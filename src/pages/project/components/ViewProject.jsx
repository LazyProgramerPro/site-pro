import {
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FileOutlined,
  HistoryOutlined,
  ProjectOutlined,
  TeamOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

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

const MemberCard = styled(Card)`
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

const DocumentCard = styled(Card)`
  border: 1px solid ${themeColors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: ${themeColors.cardShadow};
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

export default function ViewProject(props) {
  const { onClose, open } = props;
  const [initialValues, setInitialValues] = useState(initialState);
  const [activeTab, setActiveTab] = useState('1');

  const loading = useSelector((state) => state.project.loading);
  const selectedProject = useSelector((state) => state.project.editingProject);
  console.log('editingProject:', selectedProject);
  useEffect(() => {
    setInitialValues(selectedProject || initialState);
  }, [selectedProject]);

  const items = [
    {
      key: '1',
      label: 'Mã dự án',
      children: selectedProject?.code || 'N/A',
    },
    {
      key: '2',
      label: 'Tên dự án',
      children: selectedProject?.name || 'N/A',
    },
    {
      key: '3',
      label: 'Mô tả',
      children: selectedProject?.description || 'N/A',
    },
    {
      key: '4',
      label: 'Ngày bắt đầu',
      children: selectedProject?.start_at || 'N/A',
    },
    {
      key: '5',
      label: 'Ngày kết thúc',
      children: selectedProject?.finish_at || 'N/A',
    },
    {
      key: '6',
      label: 'Nhà thầu thi công',
      children: selectedProject?.nha_thau_thi_cong_name || 'N/A',
    },
    {
      key: '7',
      label: 'Tư vấn giám sát',
      children: selectedProject?.tu_van_giam_sat_name || 'N/A',
    },
    {
      key: '8',
      label: 'Tư vấn thiết kế',
      children: selectedProject?.tu_van_thiet_ke_name || 'N/A',
    },
  ];

  // Mock data for the detail view
  const mockProjectMembers = [
    { name: 'Nguyễn Văn A', role: 'Giám đốc dự án', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Trần Thị B', role: 'Kỹ sư xây dựng', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Lê Văn C', role: 'Giám sát công trình', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Phạm Thị D', role: 'Kế toán dự án', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  const mockTimeline = [
    { time: '10/01/2023', title: 'Khởi động dự án', description: 'Bắt đầu khởi động dự án với các bên liên quan' },
    { time: '15/02/2023', title: 'Hoàn thành thiết kế', description: 'Hoàn thành thiết kế chi tiết và phê duyệt' },
    { time: '05/03/2023', title: 'Bắt đầu thi công', description: 'Nhà thầu bắt đầu thi công phần móng' },
    { time: '20/04/2023', title: 'Kiểm tra tiến độ', description: 'Kiểm tra và điều chỉnh tiến độ dự án' },
    { time: '15/05/2023', title: 'Hoàn thành 30%', description: 'Dự án đã hoàn thành 30% công việc' },
  ];

  const mockDocuments = [
    { name: 'Hợp đồng thi công.pdf', type: 'pdf', size: '2.5MB', date: '10/01/2023' },
    { name: 'Bản vẽ thiết kế.dwg', type: 'dwg', size: '15MB', date: '15/02/2023' },
    { name: 'Báo cáo tiến độ tháng 3.xlsx', type: 'xlsx', size: '1.2MB', date: '05/04/2023' },
    { name: 'Biên bản nghiệm thu giai đoạn 1.pdf', type: 'pdf', size: '3MB', date: '20/04/2023' },
  ];

  // Helper function to get the document icon based on file type
  const getDocumentIcon = (type) => {
    const iconStyle = { fontSize: 32, marginRight: 12 };

    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileOutlined style={{ ...iconStyle, color: '#f5222d' }} />;
      case 'xlsx':
        return <FileOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      case 'dwg':
        return <FileOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      default:
        return <FileOutlined style={iconStyle} />;
    }
  };

  // Tabs for the detail view
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <ProjectOutlined style={{ marginRight: 8 }} />
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
            items={items}
          />
        </StyledCard>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <TeamOutlined style={{ marginRight: 8 }} />
          Thành viên
        </span>
      ),
      children: (
        <StyledCard
          title={
            <Space>
              <TeamOutlined style={{ color: themeColors.primary }} />
              <span>Thành viên dự án</span>
              <Badge count={mockProjectMembers.length} style={{ backgroundColor: themeColors.primary }} />
            </Space>
          }
        >
          <Row gutter={[24, 24]}>
            {mockProjectMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <MemberCard hoverable>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Avatar size={80} src={member.avatar} />
                    <div>
                      <Title level={5} style={{ margin: '8px 0 4px', color: themeColors.primary }}>
                        {member.name}
                      </Title>
                      <Tag color="blue">{member.role}</Tag>
                    </div>
                    <Button type="link" size="small">
                      Xem chi tiết
                    </Button>
                  </Space>
                </MemberCard>
              </Col>
            ))}
          </Row>
        </StyledCard>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Tiến độ
        </span>
      ),
      children: (
        <StyledCard>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <StyledCard
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: themeColors.primary }} /> Tóm tắt tiến độ
                  </Space>
                }
              >
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Progress
                        type="dashboard"
                        percent={35}
                        strokeColor={themeColors.primary}
                        strokeWidth={8}
                        width={180}
                      />
                      <Paragraph style={{ marginTop: 16, fontSize: 16 }}>
                        <Text strong>Hoàn thành</Text>
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Card bordered={false} style={{ background: themeColors.background }}>
                          <Statistic
                            title="Bắt đầu"
                            value={selectedProject?.start_at || 'N/A'}
                            prefix={<CalendarOutlined />}
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card bordered={false} style={{ background: themeColors.background }}>
                          <Statistic
                            title="Kết thúc dự kiến"
                            value={selectedProject?.end_at || 'N/A'}
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
                              <StatusTag color="success">Đúng tiến độ</StatusTag>
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
                  <span>Lịch sử dự án</span>
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
        <StyledCard
          title={
            <Space>
              <FileOutlined style={{ color: themeColors.primary }} />
              <span>Tài liệu dự án</span>
              <Badge count={mockDocuments.length} style={{ backgroundColor: themeColors.primary }} />
            </Space>
          }
          extra={
            <Button type="primary" icon={<UploadOutlined />}>
              Tải lên tài liệu
            </Button>
          }
        >
          <Row gutter={[24, 24]}>
            {mockDocuments.map((doc, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <DocumentCard hoverable>
                  <Space align="start">
                    {getDocumentIcon(doc.type)}
                    <div style={{ flex: 1 }}>
                      <Paragraph strong style={{ margin: 0, color: themeColors.primary }}>
                        {doc.name}
                      </Paragraph>
                      <Space size="small">
                        <Tag color="blue">{doc.type.toUpperCase()}</Tag>
                        <Text type="secondary">{doc.size}</Text>
                        <Text type="secondary">{doc.date}</Text>
                      </Space>
                    </div>
                    <Tooltip title="Tải xuống">
                      <Button type="text" shape="circle" icon={<DownloadOutlined />} />
                    </Tooltip>
                  </Space>
                </DocumentCard>
              </Col>
            ))}
          </Row>
        </StyledCard>
      ),
    },
  ];

  return (
    <StyledDrawer
      width={window.innerWidth > 768 ? 1000 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<ProjectOutlined />}
            size="large"
            style={{
              backgroundColor: themeColors.primary,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.5)',
            }}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 18 }}>
              Chi tiết dự án
            </Text>
            <Text type="secondary">{initialValues?.code || 'N/A'}</Text>
          </Space>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose
      headerStyle={{ padding: '16px 24px' }}
      bodyStyle={{ padding: '0 24px 24px 24px', backgroundColor: '#f7f9fc' }}
      footerStyle={{ textAlign: 'right', padding: '12px 24px' }}
      footer={
        <Space>
          <Button onClick={onClose}>Đóng</Button>
          <Button type="primary" icon={<FileOutlined />}>
            Xuất báo cáo
          </Button>
        </Space>
      }
    >
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin dự án..." />
        </div>
      ) : (
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
      )}
    </StyledDrawer>
  );
}
