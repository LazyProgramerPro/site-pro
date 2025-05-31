import {
  CalendarOutlined,
  DollarOutlined,
  FileOutlined,
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Card,
  Col,
  Descriptions,
  Drawer,
  message,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../../../redux/store';
import { ProjectDocumentList } from '../../project';
import { getContractAddendumDocumentList, uploadContractAddendumDocumentThunk } from '../redux/contractAddendum.slide';

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

export default function ViewContractAddendum(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(initialState);
  const [contractAddendumDetail, setContractAddendumDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Error handling states
  const [error, setError] = useState(null);

  const selectedContractAddendum = useSelector((state) => state.contractAddendum.editingContractAddendum);
  const contractAddendumDocuments = useSelector((state) => state.contractAddendum.contractAddendumDocuments);
  const contractAddendumImages = useSelector((state) => state.contractAddendum.contractAddendumImages);
  const loadingDocuments = useSelector((state) => state.contractAddendum.loadingDocuments);

  const appDispatch = useAppDispatch();

  // Fetch contract addendum detail
  const fetchContractAddendumDetail = async (contractAddendumId) => {
    if (!contractAddendumId) return;

    try {
      setLoading(true);
      setError(null);

      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, use the selected contract addendum data
      setContractAddendumDetail(selectedContractAddendum);
    } catch (err) {
      setError('Không thể tải thông tin phụ lục hợp đồng');
      console.error('Error fetching contract addendum detail:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedContractAddendum?.id && open) {
      fetchContractAddendumDetail(selectedContractAddendum.id);
      // Load documents and images for contract addendum
      dispatch(getContractAddendumDocumentList(selectedContractAddendum.id));
    }
  }, [selectedContractAddendum?.id, open, dispatch]);

  const handleClose = () => {
    setActiveTab('1');
    setError(null);
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
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };
  // Format currency
  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Upload handlers for documents
  const handleDocumentUpload = async (file) => {
    if (!selectedContractAddendum?.id) {
      message.error('Không tìm thấy thông tin phụ lục hợp đồng');
      return;
    }

    try {
      await dispatch(
        uploadContractAddendumDocumentThunk({
          file,
          contractAddendumId: selectedContractAddendum.id,
          name: file.name,
          description: `Tài liệu phụ lục hợp đồng - ${file.name}`,
        }),
      ).unwrap();
      message.success('Upload tài liệu thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload tài liệu thất bại');
    }
  };

  const handleImageUpload = async (file) => {
    if (!selectedContractAddendum?.id) {
      message.error('Không tìm thấy thông tin phụ lục hợp đồng');
      return;
    }

    try {
      await dispatch(
        uploadContractAddendumDocumentThunk({
          file,
          contractAddendumId: selectedContractAddendum.id,
          name: file.name,
          description: `Hình ảnh phụ lục hợp đồng - ${file.name}`,
        }),
      ).unwrap();
      message.success('Upload hình ảnh thành công');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload hình ảnh thất bại');
    }
  };

  // Contract addendum basic info items
  const basicInfoItems = [
    {
      key: '1',
      label: 'Mã phụ lục',
      children: contractAddendumDetail?.code || 'N/A',
    },
    {
      key: '2',
      label: 'Tên phụ lục',
      children: contractAddendumDetail?.name || 'N/A',
    },
    {
      key: '3',
      label: 'Mô tả',
      children: contractAddendumDetail?.description || 'Chưa có mô tả',
    },
    {
      key: '4',
      label: 'Dự án',
      children: contractAddendumDetail?.du_an_name || 'N/A',
    },
    {
      key: '5',
      label: 'Công trình',
      children: contractAddendumDetail?.cong_trinh_name || 'N/A',
    },
    {
      key: '6',
      label: 'Hợp đồng gốc',
      children: contractAddendumDetail?.hop_dong_name || 'N/A',
    },
    {
      key: '7',
      label: 'Hạng mục',
      children: contractAddendumDetail?.hang_muc_name || 'N/A',
    },
    {
      key: '8',
      label: 'Đơn vị',
      children: contractAddendumDetail?.don_vi || 'N/A',
    },
    {
      key: '9',
      label: 'Khối lượng',
      children: contractAddendumDetail?.khoi_luong
        ? new Intl.NumberFormat('vi-VN').format(contractAddendumDetail.khoi_luong)
        : 'N/A',
    },
    {
      key: '10',
      label: 'Đơn giá',
      children: formatCurrency(contractAddendumDetail?.don_gia),
    },
    {
      key: '11',
      label: 'Thành tiền',
      children: formatCurrency(contractAddendumDetail?.thanh_tien),
    },
    {
      key: '12',
      label: 'Người tạo',
      children: contractAddendumDetail?.creator_name || 'N/A',
    },
    {
      key: '13',
      label: 'Ngày tạo',
      children: formatDate(contractAddendumDetail?.created_at),
    },
    {
      key: '14',
      label: 'Cập nhật gần nhất',
      children: formatDate(contractAddendumDetail?.updated_at),
    },
  ];

  // Contract addendum participants
  const contractParticipants = [
    {
      name: contractAddendumDetail?.nha_thau_thi_cong_name || 'Nhà thầu thi công',
      role: 'Nhà thầu thi công',
      avatar: 'NT',
      color: '#1890ff',
    },
    {
      name: contractAddendumDetail?.tu_van_giam_sat_name || 'Tư vấn giám sát',
      role: 'Tư vấn giám sát',
      avatar: 'GS',
      color: '#52c41a',
    },
    {
      name: contractAddendumDetail?.tu_van_thiet_ke_name || 'Tư vấn thiết kế',
      role: 'Tư vấn thiết kế',
      avatar: 'TK',
      color: '#faad14',
    },
  ];

  // Mock timeline data for contract addendum
  const mockTimeline = [
    {
      time: formatDate(contractAddendumDetail?.created_at),
      title: 'Tạo phụ lục hợp đồng',
      description: 'Phụ lục hợp đồng được tạo và khởi tạo trong hệ thống',
    },
    {
      time: '31/05/2025',
      title: 'Gửi phê duyệt',
      description: 'Phụ lục được gửi đi để phê duyệt bởi các bên liên quan',
    },
    {
      time: '01/06/2025',
      title: 'Đã phê duyệt',
      description: 'Phụ lục đã được phê duyệt và có hiệu lực thi hành',
    },
  ];
  // Mock documents for contract addendum
  const mockDocuments = [
    { name: 'Phụ lục hợp đồng.pdf', type: 'pdf', size: '2.8MB', date: '30/05/2025' },
    { name: 'Biên bản thỏa thuận.pdf', type: 'pdf', size: '1.5MB', date: '30/05/2025' },
    { name: 'Bảng dự toán bổ sung.xlsx', type: 'xlsx', size: '1.1MB', date: '29/05/2025' },
    { name: 'Bản vẽ điều chỉnh.dwg', type: 'dwg', size: '5.2MB', date: '28/05/2025' },
  ];

  // Tabs for the detail view
  const tabItems = [
    {
      key: '1',
      label: (
        <Space>
          <FileTextOutlined />
          Thông tin cơ bản
        </Space>
      ),
      children: (
        <div>
          <StyledCard title="Thông tin phụ lục hợp đồng" style={{ marginBottom: 16 }}>
            <StyledDescriptions
              bordered
              column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              items={basicInfoItems}
            />
          </StyledCard>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <InfoCard>
                <DollarOutlined style={{ fontSize: '32px', color: themeColors.success, marginBottom: '12px' }} />
                <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
                  {formatCurrency(contractAddendumDetail?.thanh_tien)}
                </Title>
                <Text type="secondary">Giá trị phụ lục</Text>
              </InfoCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoCard>
                <ProjectOutlined style={{ fontSize: '32px', color: themeColors.primary, marginBottom: '12px' }} />
                <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
                  {contractAddendumDetail?.khoi_luong
                    ? new Intl.NumberFormat('vi-VN').format(contractAddendumDetail.khoi_luong)
                    : 'N/A'}
                </Title>
                <Text type="secondary">Khối lượng ({contractAddendumDetail?.don_vi || 'đơn vị'})</Text>
              </InfoCard>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoCard>
                <CalendarOutlined style={{ fontSize: '32px', color: themeColors.warning, marginBottom: '12px' }} />
                <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
                  {formatDate(contractAddendumDetail?.created_at).split(' ')[0]}
                </Title>
                <Text type="secondary">Ngày tạo phụ lục</Text>
              </InfoCard>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <TeamOutlined />
          Các bên tham gia
        </Space>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {contractParticipants.map((participant, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <InfoCard>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: participant.color,
                    marginBottom: '16px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {participant.avatar}
                </Avatar>
                <Title level={5} style={{ margin: '8px 0 4px 0', color: themeColors.textPrimary }}>
                  {participant.name}
                </Title>
                <Text type="secondary">{participant.role}</Text>
              </InfoCard>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      key: '3',
      label: (
        <Space>
          <CalendarOutlined />
          Lịch sử thay đổi
        </Space>
      ),
      children: (
        <StyledCard title="Tiến trình phụ lục hợp đồng">
          <Timeline
            items={mockTimeline.map((item, index) => ({
              dot: <CalendarOutlined style={{ fontSize: '16px' }} />,
              children: (
                <div>
                  <Text strong>{item.title}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.time}
                  </Text>
                  <br />
                  <Paragraph style={{ marginTop: '4px', marginBottom: 0 }}>{item.description}</Paragraph>
                </div>
              ),
            }))}
          />
        </StyledCard>
      ),
    },
    {
      key: '4',
      label: (
        <Space>
          <FileOutlined />
          Tài liệu đính kèm
        </Space>
      ),
      children: (
        <ProjectDocumentList
          documents={contractAddendumDocuments}
          loading={loadingDocuments}
          title="Tài liệu đính kèm"
          entityType="phụ lục hợp đồng"
          showUploadButton={true}
          onUpload={handleDocumentUpload}
          onPreview={(doc) => message.info(`Xem trước: ${doc.name}`)}
          onDownload={(url, name) => message.info(`Tải xuống: ${name}`)}
          formatDate={formatDate}
        />
      ),
    },
  ];

  useEffect(() => {
    setInitialValues(contractAddendumDetail || initialState);
  }, [contractAddendumDetail]);
  return (
    <StyledDrawer
      width={1000}
      title={`Chi tiết phụ lục hợp đồng ${initialValues?.code || ''}`}
      placement="right"
      onClose={handleClose}
      open={open}
    >
      {loading ? (
        renderLoadingSkeleton()
      ) : error ? (
        <Alert message="Lỗi" description={error} type="error" showIcon style={{ margin: '20px 0' }} />
      ) : !isEmpty(contractAddendumDetail) ? (
        <StyledTab activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      ) : (
        <Alert
          message="Không có dữ liệu"
          description="Không tìm thấy thông tin phụ lục hợp đồng"
          type="warning"
          showIcon
          style={{ margin: '20px 0' }}
        />
      )}
    </StyledDrawer>
  );
}

// Styled Components
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
