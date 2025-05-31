import {
  BuildOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileOutlined,
  FileTextOutlined,
  HistoryOutlined,
  PictureOutlined,
  ProjectOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  message,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import http from '../../../utils/http';
import { ProjectDocumentList, ProjectImageList } from '../../project';
import { getContractDocumentList, uploadContractDocumentThunk } from '../redux/contract.slice';

const { Title, Paragraph, Text } = Typography;

const initialState = {};

// Theme colors
const themeColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  border: '#f0f0f0',
  background: '#fafafa',
  cardShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  textPrimary: 'rgba(0, 0, 0, 0.85)',
  textSecondary: 'rgba(0, 0, 0, 0.45)',
};

export default function ViewContract(props) {
  const { onClose, open } = props;
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(initialState);
  const [contractDetail, setContractDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Error handling states
  const [error, setError] = useState(null);

  const selectedContract = useSelector((state) => state.contract.editingContract);
  const contractDocuments = useSelector((state) => state.contract.contractDocuments);
  const contractImages = useSelector((state) => state.contract.contractImages);
  const loadingDocuments = useSelector((state) => state.contract.loadingDocuments);

  // Fetch contract detail
  const fetchContractDetail = async (contractId) => {
    setLoading(true);
    setError(null);
    try {
      const { rc, item } = await http.post('/auth/hopdong/info', { id: contractId });

      if (rc?.code !== 0) {
        throw new Error(rc?.message || 'Không thể tải thông tin hợp đồng');
      }
      setContractDetail(item);
      setInitialValues({
        code: item.code,
        name: item.name,
        description: item.description,
        du_an_id: item.du_an_id,
        cong_trinh_id: item.cong_trinh_id,
        ben_a_id: item.ben_a_id,
        ben_b_id: item.ben_b_id,
        contractImages: item.contractImages || [],
        contractDocuments: item.contractDocuments || [],
      });
    } catch (error) {
      console.error('Failed to fetch contract detail:', error);
      setError(error?.response?.data?.message || error.message || 'Không thể tải thông tin hợp đồng');
      message.error('Không thể tải thông tin hợp đồng');
      setContractDetail(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedContract?.id && open) {
      fetchContractDetail(selectedContract.id);
      // Load documents and images for contract
      dispatch(getContractDocumentList(selectedContract.id));
    }
  }, [selectedContract?.id, open, dispatch]); // Reset states when closing
  const handleClose = () => {
    setContractDetail(null);
    setInitialValues(initialState);
    setError(null);
    setActiveTab('1');
    onClose();
  };

  // Loading skeleton component
  const renderLoadingSkeleton = () => (
    <div style={{ padding: '16px' }}>
      <StyledCard>
        <Skeleton active paragraph={{ rows: 6 }} />
      </StyledCard>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StyledCard>
            <Skeleton active paragraph={{ rows: 3 }} />
          </StyledCard>
        </Col>
        <Col span={12}>
          <StyledCard>
            <Skeleton active paragraph={{ rows: 3 }} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Contract basic info items
  const basicInfoItems = [
    {
      key: '1',
      label: 'Mã hợp đồng',
      children: contractDetail?.code || 'N/A',
    },
    {
      key: '2',
      label: 'Tên hợp đồng',
      children: contractDetail?.name || 'N/A',
    },
    {
      key: '3',
      label: 'Mô tả',
      children: contractDetail?.description || 'Chưa có mô tả',
    },
    {
      key: '4',
      label: 'Ngày tạo',
      children: formatDate(contractDetail?.created_at),
    },
    {
      key: '5',
      label: 'Cập nhật gần nhất',
      children: formatDate(contractDetail?.updated_at),
    },
    {
      key: '6',
      label: 'Người tạo',
      children: contractDetail?.creator_name || 'N/A',
    },
  ];

  // Mock data for contract participants
  const contractParticipants = [
    {
      name: contractDetail?.ben_a_name || 'Bên A',
      role: 'Bên A - Chủ đầu tư',
      avatar: 'A',
      color: '#1890ff',
    },
    {
      name: contractDetail?.ben_b_name || 'Bên B',
      role: 'Bên B - Nhà thầu',
      avatar: 'B',
      color: '#52c41a',
    },
  ]; // Mock timeline data
  const mockTimeline = [
    { time: '29/05/2025', title: 'Tạo hợp đồng', description: 'Hợp đồng được tạo và khởi tạo trong hệ thống' },
    { time: '30/05/2025', title: 'Gửi phê duyệt', description: 'Hợp đồng được gửi đi để phê duyệt' },
    { time: '01/06/2025', title: 'Đang thực hiện', description: 'Bắt đầu thực hiện theo điều khoản hợp đồng' },
  ];

  // Upload handlers for documents
  const handleDocumentUpload = async (file) => {
    if (!selectedContract?.id) {
      message.error('Không tìm thấy thông tin hợp đồng');
      return;
    }

    try {
      await dispatch(
        uploadContractDocumentThunk({
          file,
          contractId: selectedContract.id,
          name: file.name,
          description: `Tài liệu hợp đồng - ${file.name}`,
        }),
      ).unwrap();
      message.success('Upload tài liệu thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload tài liệu thất bại');
    }
  };

  const handleImageUpload = async (file) => {
    if (!selectedContract?.id) {
      message.error('Không tìm thấy thông tin hợp đồng');
      return;
    }

    try {
      await dispatch(
        uploadContractDocumentThunk({
          file,
          contractId: selectedContract.id,
          name: file.name,
          description: `Hình ảnh hợp đồng - ${file.name}`,
        }),
      ).unwrap();
      message.success('Upload hình ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload hình ảnh thất bại');
    }
  };

  // Tabs for the detail view
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Thông tin chung
        </span>
      ),
      children: (
        <StyledCard>
          <StyledDescriptions
            bordered
            column={{ xs: 1, sm: 2, md: 2 }}
            size="middle"
            labelStyle={{ fontWeight: 500 }}
            items={basicInfoItems}
          />
        </StyledCard>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          Các bên tham gia
        </span>
      ),
      children: (
        <StyledCard
          title={
            <Space>
              <TeamOutlined style={{ color: themeColors.primary }} />
              <span>Các bên trong hợp đồng</span>
              <Badge count={contractParticipants.length} style={{ backgroundColor: themeColors.primary }} />
            </Space>
          }
        >
          <Row gutter={[24, 24]}>
            {contractParticipants.map((participant, index) => (
              <Col xs={24} sm={12} md={12} lg={12} key={index}>
                <InfoCard hoverable>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Avatar size={80} style={{ backgroundColor: participant.color }}>
                      {participant.avatar}
                    </Avatar>
                    <div>
                      <Title level={5} style={{ margin: '8px 0 4px', color: themeColors.primary }}>
                        {participant.name}
                      </Title>
                      <Tag color={participant.color}>{participant.role}</Tag>
                    </div>
                    <Button type="link" size="small">
                      Xem chi tiết
                    </Button>
                  </Space>
                </InfoCard>
              </Col>
            ))}
          </Row>

          <Divider orientation="left">
            <Space>
              <ProjectOutlined />
              <span>Thông tin dự án & công trình</span>
            </Space>
          </Divider>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ background: themeColors.background }}>
                <Statistic title="Dự án" value={contractDetail?.du_an_name || 'N/A'} prefix={<ProjectOutlined />} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card bordered={false} style={{ background: themeColors.background }}>
                <Statistic
                  title="Công trình"
                  value={contractDetail?.cong_trinh_name || 'N/A'}
                  prefix={<BuildOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </StyledCard>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Tiến độ & Trạng thái
        </span>
      ),
      children: (
        <StyledCard>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <StyledCard
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: themeColors.primary }} />
                    Tóm tắt trạng thái hợp đồng
                  </Space>
                }
              >
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Progress
                        type="dashboard"
                        percent={75}
                        strokeColor={themeColors.success}
                        strokeWidth={8}
                        width={180}
                      />
                      <Paragraph style={{ marginTop: 16, fontSize: 16 }}>
                        <Text strong>Đang thực hiện</Text>
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Card bordered={false} style={{ background: themeColors.background }}>
                          <Statistic
                            title="Ngày tạo"
                            value={formatDate(contractDetail?.created_at)}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} style={{ background: themeColors.background }}>
                          <Statistic
                            title="Cập nhật gần nhất"
                            value={formatDate(contractDetail?.updated_at)}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={24}>
                        <Card bordered={false} style={{ background: themeColors.background }}>
                          <Row align="middle" gutter={16}>
                            <Col>
                              <Text strong>Trạng thái:</Text>
                            </Col>
                            <Col>
                              <StatusTag color="success">Đang thực hiện</StatusTag>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </StyledCard>

              <Divider orientation="left">
                <Space>
                  <HistoryOutlined />
                  <span>Lịch sử hợp đồng</span>
                </Space>
              </Divider>

              <Timeline
                mode="left"
                items={mockTimeline.map((item, index) => ({
                  color:
                    index === 0
                      ? themeColors.success
                      : index === mockTimeline.length - 1
                      ? themeColors.primary
                      : undefined,
                  label: <Tag color={index % 2 === 0 ? 'blue' : 'cyan'}>{item.time}</Tag>,
                  children: (
                    <Card size="small" style={{ marginBottom: 8 }} hoverable>
                      <Text
                        strong
                        style={{ fontSize: 16, display: 'block', color: themeColors.primary, marginBottom: 4 }}
                      >
                        {item.title}
                      </Text>
                      <Paragraph style={{ margin: 0 }}>{item.description}</Paragraph>
                    </Card>
                  ),
                }))}
              />
            </Col>
          </Row>
        </StyledCard>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          Tài liệu
        </span>
      ),
      children: (
        <ProjectDocumentList
          documents={contractDocuments}
          loading={loadingDocuments}
          title="Tài liệu hợp đồng"
          entityType="hợp đồng"
          showUploadButton={true}
          onUpload={handleDocumentUpload}
          onPreview={(doc) => message.info(`Xem trước: ${doc.name}`)}
          onDownload={(url, name) => message.info(`Tải xuống: ${name}`)}
          formatDate={formatDate}
        />
      ),
    },
    {
      key: '5',
      label: (
        <span>
          <PictureOutlined style={{ marginRight: 8 }} />
          Hình ảnh
        </span>
      ),
      children: (
        <ProjectImageList
          images={contractImages}
          loading={loadingDocuments}
          title="Hình ảnh hợp đồng"
          entityType="hợp đồng"
          showUploadButton={true}
          onUpload={handleImageUpload}
          onPreview={(image) => message.info(`Xem ảnh: ${image.name}`)}
          onDownload={(url, name) => message.info(`Tải xuống: ${name}`)}
          formatDate={formatDate}
        />
      ),
    },
  ];
  return (
    <StyledDrawer
      width={window.innerWidth > 768 ? 1000 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<FileTextOutlined />}
            size="large"
            style={{
              backgroundColor: themeColors.primary,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.5)',
            }}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 18 }}>
              Chi tiết hợp đồng
            </Text>
            <Text type="secondary">{initialValues?.code || 'N/A'}</Text>
          </Space>
        </Space>
      }
      placement="right"
      onClose={handleClose}
      open={open}
      destroyOnClose
      headerStyle={{ padding: '16px 24px' }}
      bodyStyle={{ padding: '0 24px 24px 24px', backgroundColor: '#f7f9fc' }}
      footerStyle={{ textAlign: 'right', padding: '12px 24px' }}
      footer={
        <Space>
          <Button onClick={handleClose}>Đóng</Button>
          <Button type="primary" icon={<FileOutlined />}>
            Xuất báo cáo
          </Button>
        </Space>
      }
    >
      {loading ? (
        renderLoadingSkeleton()
      ) : error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
          }}
        >
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            action={
              <Button
                size="small"
                type="primary"
                onClick={() => selectedContract?.id && fetchContractDetail(selectedContract.id)}
              >
                Thử lại
              </Button>
            }
          />
        </div>
      ) : contractDetail ? (
        <StyledTab
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          type="card"
          size="large"
          tabBarGutter={8}
          style={{ marginTop: 16 }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            flexDirection: 'column',
          }}
        >
          <Alert
            message="Không có dữ liệu"
            description="Không thể tải thông tin hợp đồng hoặc hợp đồng không tồn tại."
            type="warning"
            showIcon
          />
        </div>
      )}
    </StyledDrawer>
  );
}

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${themeColors.cardShadow};
  margin-bottom: 16px;

  .ant-card-head {
    border-bottom: 1px solid ${themeColors.border};
  }

  .ant-card-body {
    padding: 20px;
  }
`;

const InfoCard = styled(Card)`
  border: 1px solid ${themeColors.border};
  border-radius: 12px;
  box-shadow: ${themeColors.cardShadow};
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 16px 24px;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-drawer-body {
    padding: 0 24px 24px 24px;
    background-color: #f7f9fc;
  }

  .ant-tabs-nav {
    margin-bottom: 20px;
  }

  .ant-drawer-footer {
    text-align: right;
    padding: 12px 24px;
  }
`;

const StyledTab = styled(Tabs)`
  .ant-tabs-tab {
    padding: 12px 16px;
    transition: all 0.3s;

    &:hover {
      color: ${themeColors.primary};
    }
  }

  .ant-tabs-tab-active {
    font-weight: 500;
  }
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: 500;
    color: ${themeColors.textSecondary};
  }

  .ant-descriptions-item-content {
    color: ${themeColors.textPrimary};
  }
`;

const StatusTag = styled(Tag)`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;
