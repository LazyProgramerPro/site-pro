import {
  BuildOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
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
  Empty,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getProjectDocumentList, uploadProjectDocumentThunk } from '../redux/project.slice';
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

// CSS Animations
const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  
  .document-card {
    animation: slideUp 0.3s ease forwards;
  }
  
  .document-card:hover .ant-typography {
    color: ${themeColors.primary} !important;
    text-decoration: underline;
  }
  
  .document-card:hover svg {
    transform: scale(1.1);
  }
`;

// Add global styles
const GlobalStyle = document.createElement('style');
GlobalStyle.textContent = keyframes;
document.head.appendChild(GlobalStyle);

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${themeColors.cardShadow};
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

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
    border-color: ${themeColors.primary}20;
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
  height: 100%;

  &:hover {
    background-color: #f8f9ff;
    transform: translateY(-2px);
    box-shadow: ${themeColors.cardShadow};
    border-color: ${themeColors.primary}30;
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
    border-top: 1px solid #f0f0f0;
  }

  @media (max-width: 768px) {
    .ant-drawer-content-wrapper {
      width: 100% !important;
    }
  }
`;

const StyledTab = styled(Tabs)`
  .ant-tabs-tab {
    padding: 12px 16px;
    transition: all 0.3s;

    &:hover {
      color: ${themeColors.primary};
      background-color: ${themeColors.primary}10;
      border-radius: 8px 8px 0 0;
    }
  }

  .ant-tabs-tab-active {
    font-weight: 500;

    .ant-tabs-tab-btn {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: ${themeColors.primary};
        border-radius: 3px 3px 0 0;
        animation: tabActive 0.3s ease;
      }
    }
  }

  @keyframes tabActive {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100%;
      opacity: 1;
    }
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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

// Thêm các styled-components mới
const AnimatedAvatar = styled(Avatar)`
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px ${themeColors.primary}60;
  }
`;

const StatisticCard = styled(Card)`
  background: ${themeColors.background};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f7ff;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  }

  .ant-statistic-title {
    color: ${themeColors.textSecondary};
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    color: ${themeColors.textPrimary};
    font-weight: 500;
  }
`;

const ImageCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
  height: 100%;

  .image-container {
    height: 160px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 8px 8px 0 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

    .image-container img {
      transform: scale(1.05);
    }
  }

  .ant-card-actions {
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
  }
`;

const StyledProgress = styled(Progress)`
  .ant-progress-text {
    font-weight: 500;
    font-size: 16px;
  }

  .ant-progress-inner {
    box-shadow: 0 0 12px ${themeColors.primary}30;
  }
`;

const StyledTimeline = styled(Timeline)`
  .ant-timeline-item-tail {
    border-left: 2px solid #e8e8e8;
  }

  .ant-timeline-item-head {
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border: 2px solid ${themeColors.primary};
  }

  .ant-timeline-item-content {
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(5px);
    }
  }
`;

const AnimatedButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    &::after {
      animation: ripple 1s ease-out;
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    box-shadow: 0 0 0 2px #fff;
    transition: all 0.3s ease;
  }

  &:hover .ant-badge-count {
    transform: scale(1.1);
  }
`;

// Styled components cho danh sách tài liệu
const DocumentList = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const DocumentListItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${themeColors.border};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f0f7ff;
    cursor: pointer;
  }

  .document-info {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  .document-details {
    margin-left: 12px;
    flex: 1;
    min-width: 0;
  }

  .document-title {
    color: ${themeColors.textPrimary};
    font-weight: 500;
    margin-bottom: 4px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .document-meta {
    color: ${themeColors.textSecondary};
    font-size: 12px;
  }

  .document-actions {
    display: flex;
    gap: 8px;
    margin-left: 16px;
  }

  .document-icon {
    font-size: 28px;
    margin-right: 16px;
    transition: transform 0.3s ease;
  }

  &:hover .document-icon {
    transform: scale(1.1);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;

    .document-actions {
      margin-left: 0;
      margin-top: 12px;
      align-self: flex-end;
    }
  }
`;

// Styled component cho danh sách hình ảnh
const ImageListItem = styled(DocumentListItem)`
  .image-thumbnail {
    width: 60px;
    height: 60px;
    min-width: 60px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover .image-thumbnail {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    img {
      transform: scale(1.1);
    }
  }
`;

export default function ViewProject(props) {
  const { onClose, open } = props;
  const [initialValues, setInitialValues] = useState(initialState);
  const [activeTab, setActiveTab] = useState('1');

  // State cho modal xem trước tài liệu
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

  // State và handlers cho upload tài liệu
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // State cho tìm kiếm và sắp xếp tài liệu
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('name-asc'); // name-asc, name-desc, date-asc, date-desc

  // Hàm lọc và sắp xếp danh sách tài liệu
  const getFilteredAndSortedDocuments = (documents) => {
    if (!documents || !Array.isArray(documents)) return [];

    return documents
      .filter((doc) => doc.name?.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        if (sortType === 'name-asc') {
          return a.name?.localeCompare(b.name || '');
        } else if (sortType === 'name-desc') {
          return b.name?.localeCompare(a.name || '');
        } else if (sortType === 'date-asc') {
          return new Date(a.date || 0) - new Date(b.date || 0);
        } else if (sortType === 'date-desc') {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        return 0;
      });
  };

  // Xử lý hiển thị modal upload
  const showUploadModal = () => {
    setFileList([]);
    setUploadModalVisible(true);
  };

  // Hàm mở modal xem trước tài liệu
  const showDocumentPreview = (document) => {
    setCurrentDocument(document);
    setPreviewVisible(true);
  };

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.project.loading);
  const selectedProject = useSelector((state) => state.project.editingProject);
  const projectDocuments = useSelector((state) => state.project.projectDocuments);
  const projectImages = useSelector((state) => state.project.projectImages);
  const loadingDocuments = useSelector((state) => state.project.loadingDocuments);

  // Debug thông tin về tài liệu
  console.log('projectDocuments:', projectDocuments);
  console.log('projectImages:', projectImages);
  console.log('loadingDocuments:', loadingDocuments);

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Nếu không phải là định dạng ngày hợp lệ

      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // useEffect để lấy thông tin project và tài liệu
  useEffect(() => {
    setInitialValues(selectedProject || initialState);

    if (selectedProject?.id) {
      // Lấy danh sách tài liệu khi component mount hoặc khi selectedProject thay đổi
      console.log('Loading project documents for project ID:', selectedProject.id);
      dispatch(getProjectDocumentList(selectedProject.id)).then((response) => {
        if (response.error) {
          message.error('Không thể tải danh sách tài liệu dự án');
        } else {
          console.log('Documents loaded successfully');
        }
      });
    }
  }, [selectedProject, dispatch]);
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
      children: formatDate(selectedProject?.start_at) || 'N/A',
    },
    {
      key: '5',
      label: 'Ngày kết thúc',
      children: formatDate(selectedProject?.finish_at) || 'N/A',
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
  const getDocumentIcon = (type) => {
    const iconStyle = {
      fontSize: 32,
      marginRight: 12,
      transition: 'transform 0.3s ease',
    };

    switch (type.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined style={{ ...iconStyle, color: '#f5222d' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ ...iconStyle, color: '#52c41a' }} />;
      default:
        return <FileUnknownOutlined style={iconStyle} />;
    }
  };

  // Function để mở file trong tab mới
  const openDocument = (url) => {
    if (url) window.open(url, '_blank');
  };

  // Function để download file
  const downloadFile = (url, fileName) => {
    if (!url) {
      message.error('URL tài liệu không hợp lệ');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('Không thể tải xuống tài liệu');
    }
  };

  // Component hiển thị skeleton loading
  const ProjectDetailSkeleton = () => (
    <div style={{ padding: '20px 0' }}>
      <Skeleton active paragraph={{ rows: 1 }} />
      <div style={{ marginTop: 20 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );

  // Dữ liệu timeline mẫu
  const mockTimeline = [
    { time: '10/01/2023', title: 'Khởi động dự án', description: 'Bắt đầu khởi động dự án với các bên liên quan' },
    { time: '15/02/2023', title: 'Hoàn thành thiết kế', description: 'Hoàn thành thiết kế chi tiết và phê duyệt' },
    { time: '05/03/2023', title: 'Bắt đầu thi công', description: 'Nhà thầu bắt đầu thi công phần móng' },
    { time: '20/04/2023', title: 'Kiểm tra tiến độ', description: 'Kiểm tra và điều chỉnh tiến độ dự án' },
    { time: '15/05/2023', title: 'Hoàn thành 30%', description: 'Dự án đã hoàn thành 30% công việc' },
  ];
  const DocumentSkeleton = () => (
    <Row gutter={[24, 24]}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Col xs={24} sm={12} md={8} key={item}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      ))}
    </Row>
  );

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
          {loading ? (
            <ProjectDetailSkeleton />
          ) : (
            <StyledDescriptions
              bordered
              column={{ xs: 1, sm: 2, md: 2 }}
              size="middle"
              labelStyle={{ fontWeight: 500 }}
              items={items}
            />
          )}
        </StyledCard>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <BuildOutlined style={{ marginRight: 8 }} />
          Nhà thầu & đơn vị
        </span>
      ),
      children: (
        <StyledCard
          title={
            <Space>
              <BuildOutlined style={{ color: themeColors.primary }} />
              <span>Thông tin nhà thầu & đơn vị</span>
            </Space>
          }
        >
          {' '}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <StatisticCard bordered={false}>
                <Statistic
                  title="Nhà thầu thi công"
                  value={selectedProject?.nha_thau_thi_cong_name || 'N/A'}
                  prefix={<BuildOutlined />}
                />
              </StatisticCard>
            </Col>
            <Col xs={24} md={12}>
              <StatisticCard bordered={false}>
                <Statistic
                  title="Tư vấn giám sát"
                  value={selectedProject?.tu_van_giam_sat_name || 'N/A'}
                  prefix={<TeamOutlined />}
                />
              </StatisticCard>
            </Col>
            <Col xs={24} md={12}>
              <StatisticCard bordered={false}>
                <Statistic
                  title="Tư vấn thiết kế"
                  value={selectedProject?.tu_van_thiet_ke_name || 'N/A'}
                  prefix={<ProjectOutlined />}
                />
              </StatisticCard>
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
                  {' '}
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center' }}>
                      <StyledProgress
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
                      {' '}
                      <Col span={12}>
                        <StatisticCard bordered={false}>
                          <Statistic
                            title="Bắt đầu"
                            value={formatDate(selectedProject?.start_at) || 'N/A'}
                            prefix={<CalendarOutlined />}
                          />
                        </StatisticCard>
                      </Col>
                      <Col span={12}>
                        <StatisticCard bordered={false}>
                          <Statistic
                            title="Kết thúc dự kiến"
                            value={formatDate(selectedProject?.end_at) || 'N/A'}
                            prefix={<CalendarOutlined />}
                          />
                        </StatisticCard>
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
              </StyledCard>{' '}
              <Divider orientation="left">
                <Space>
                  <HistoryOutlined />
                  <span>Lịch sử dự án</span>
                </Space>
              </Divider>
              <StyledTimeline
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
              <span>Tài liệu dự án</span>{' '}
              <StyledBadge count={projectDocuments.length} style={{ backgroundColor: themeColors.primary }} />
            </Space>
          }
          extra={
            <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={showUploadModal}>
              Tải lên tài liệu
            </AnimatedButton>
          }
        >
          {loadingDocuments ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải tài liệu..." />
            </div>
          ) : projectDocuments.length > 0 ? (
            <DocumentList>
              {getFilteredAndSortedDocuments(projectDocuments).map((doc, index) => (
                <DocumentListItem key={index} onClick={() => showDocumentPreview(doc)}>
                  <div className="document-info">
                    <div className="document-icon">{getDocumentIcon(doc.type)}</div>
                    <div className="document-details">
                      <Tooltip title={doc.name}>
                        <div className="document-title">{doc.name}</div>
                      </Tooltip>
                      <div className="document-meta">
                        <Space size="middle">
                          <Tag color="blue">{doc.type?.toUpperCase()}</Tag>
                          {doc.size && <span>{doc.size}</span>}
                          {doc.date && <span>Ngày tạo: {formatDate(doc.date)}</span>}
                          {doc.creator && <span>Người tạo: {doc.creator}</span>}
                        </Space>
                      </div>
                    </div>
                  </div>
                  <div className="document-actions">
                    <Tooltip title="Xem trước">
                      <AnimatedButton
                        type="default"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          showDocumentPreview(doc);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Tải xuống">
                      <AnimatedButton
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(doc.url, doc.name);
                        }}
                      />
                    </Tooltip>
                  </div>
                </DocumentListItem>
              ))}
            </DocumentList>
          ) : (
            <Empty
              description="Chưa có tài liệu nào cho dự án này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: '40px 0' }}
            />
          )}
        </StyledCard>
      ),
    },
    {
      key: '5',
      label: (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          Hình ảnh
        </span>
      ),
      children: (
        <StyledCard
          title={
            <Space>
              <FileOutlined style={{ color: themeColors.primary }} />
              <span>Hình ảnh dự án</span>
              <StyledBadge count={projectImages.length} style={{ backgroundColor: themeColors.primary }} />
            </Space>
          }
          extra={
            <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={showUploadModal}>
              Tải lên hình ảnh
            </AnimatedButton>
          }
        >
          {loadingDocuments ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Spin size="large" tip="Đang tải hình ảnh..." />
            </div>
          ) : projectImages.length > 0 ? (
            <DocumentList>
              {projectImages.map((image, index) => (
                <ImageListItem key={index} onClick={() => showDocumentPreview(image)}>
                  <div className="document-info">
                    <div className="image-thumbnail">
                      <img
                        src={image.url}
                        alt={image.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/60x60?text=Lỗi';
                        }}
                      />
                    </div>
                    <div className="document-details">
                      <Tooltip title={image.name}>
                        <div className="document-title">{image.name}</div>
                      </Tooltip>
                      <div className="document-meta">
                        <Space size="middle">
                          <Tag color="green">Hình ảnh</Tag>
                          {image.size && <span>{image.size}</span>}
                          {image.date && <span>Ngày tạo: {formatDate(image.date)}</span>}
                          {image.creator && <span>Người tạo: {image.creator}</span>}
                        </Space>
                      </div>
                    </div>
                  </div>
                  <div className="document-actions">
                    <Tooltip title="Xem ảnh">
                      <AnimatedButton
                        type="default"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          showDocumentPreview(image);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Tải xuống">
                      <AnimatedButton
                        type="primary"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(image.url, image.name);
                        }}
                      />
                    </Tooltip>
                  </div>
                </ImageListItem>
              ))}
            </DocumentList>
          ) : (
            <Empty
              description="Chưa có hình ảnh nào cho dự án này"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ margin: '40px 0' }}
            />
          )}
        </StyledCard>
      ),
    },
  ];
  // Component hiển thị chi tiết tài liệu
  const DocumentPreview = ({ document, onDownload }) => {
    console.log('Previewing document:', document);

    // Xác định loại tài liệu dựa vào phần mở rộng
    const isPreviewable = (doc) => {
      if (!doc || !doc.name) return false;

      const lowerName = doc.name.toLowerCase();
      return (
        lowerName.endsWith('.pdf') ||
        lowerName.endsWith('.txt') ||
        lowerName.endsWith('.jpg') ||
        lowerName.endsWith('.jpeg') ||
        lowerName.endsWith('.png') ||
        lowerName.endsWith('.gif')
      );
    };

    const renderPreview = () => {
      if (!document) {
        console.log('No document to preview');
        return (
          <Empty
            description="Không có tài liệu để xem trước"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
          />
        );
      }

      // Kiểm tra URL hợp lệ
      if (!document.url) {
        console.log('Document URL is missing');
        return (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <FileUnknownOutlined style={{ fontSize: '64px', color: themeColors.error }} />
            </div>
            <Title level={4}>Không thể xem trước tài liệu</Title>
            <Paragraph>URL tài liệu không hợp lệ hoặc bị thiếu</Paragraph>
            <Button type="primary" onClick={() => setPreviewVisible(false)}>
              Đóng
            </Button>
          </div>
        );
      }

      const lowerName = document.name.toLowerCase();
      const fileType = document.type || lowerName.split('.').pop();
      console.log('Document type:', fileType);
      if (lowerName.endsWith('.pdf')) {
        return (
          <div className="pdf-container" style={{ position: 'relative', height: '70vh' }}>
            <div
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
            >
              <Spin size="large" tip="Đang tải PDF..." />
            </div>
            <iframe
              src={`${document.url}#view=FitH`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
              title={document.name}
              onLoad={(e) => {
                const container = e.target.closest('.pdf-container');
                if (container) {
                  const spinner = container.querySelector('.ant-spin');
                  if (spinner) spinner.style.display = 'none';
                }
              }}
            />
          </div>
        );
      } else if (
        lowerName.endsWith('.jpg') ||
        lowerName.endsWith('.jpeg') ||
        lowerName.endsWith('.png') ||
        lowerName.endsWith('.gif') ||
        ['jpg', 'jpeg', 'png', 'gif'].includes(fileType)
      ) {
        return (
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f7f7f7',
              borderRadius: '8px',
            }}
          >
            <div style={{ position: 'relative', maxHeight: '65vh', maxWidth: '100%', marginBottom: '16px' }}>
              <Spin
                spinning={true}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <img
                src={document.url}
                alt={document.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                }}
                onLoad={(e) => {
                  const spinner = e.target.previousSibling;
                  if (spinner) spinner.style.display = 'none';
                }}
                onError={(e) => {
                  console.log('Image load error');
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Không+tải+được+ảnh';
                  const spinner = e.target.previousSibling;
                  if (spinner) spinner.style.display = 'none';
                }}
              />
            </div>
            <Space>
              <AnimatedButton icon={<DownloadOutlined />} onClick={() => onDownload(document.url, document.name)}>
                Tải xuống
              </AnimatedButton>
              <AnimatedButton type="primary" icon={<EyeOutlined />} onClick={() => window.open(document.url, '_blank')}>
                Xem trong tab mới
              </AnimatedButton>
            </Space>
          </div>
        );
      } else if (lowerName.endsWith('.txt')) {
        return (
          <div style={{ position: 'relative', height: '70vh' }}>
            <div
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
            >
              <Spin size="large" tip="Đang tải tài liệu..." />
            </div>
            <iframe
              src={document.url}
              style={{
                width: '100%',
                height: '70vh',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              title={document.name}
              onLoad={(e) => {
                const spinner = e.target.previousSibling;
                if (spinner) spinner.style.display = 'none';
              }}
            />
          </div>
        );
      }

      return (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '20px',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          >
            {getDocumentIcon(document.type || 'unknown')}
          </div>
          <Title level={4}>{document.name}</Title>
          <Paragraph>Không thể xem trước tài liệu này. Vui lòng tải xuống để xem.</Paragraph>
          <Space style={{ marginTop: '20px' }}>
            <AnimatedButton
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => onDownload(document.url, document.name)}
            >
              Tải xuống
            </AnimatedButton>
            {document.url && (
              <AnimatedButton icon={<EyeOutlined />} onClick={() => window.open(document.url, '_blank')}>
                Mở trong tab mới
              </AnimatedButton>
            )}
          </Space>

          <style jsx>{`
            @keyframes pulse {
              0% {
                transform: scale(1);
                opacity: 0.8;
              }
              50% {
                transform: scale(1.05);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 0.8;
              }
            }
          `}</style>
        </div>
      );
    };

    return renderPreview();
  };
  // Xử lý upload tài liệu
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một tài liệu để tải lên!');
      return;
    }

    setUploadLoading(true);
    try {
      // Upload các tài liệu từ fileList
      const uploadPromises = fileList.map((file) => {
        console.log('Uploading file:', file.name);
        // Gọi action thunk để upload tài liệu dự án
        return dispatch(
          uploadProjectDocumentThunk({
            file: file.originFileObj,
            projectId: selectedProject.id,
            name: file.name,
            description: `Tài liệu dự án - ${file.name}`,
          }),
        );
      });

      await Promise.all(uploadPromises);

      message.success('Tải lên tài liệu thành công!');
      setUploadModalVisible(false);
      setFileList([]);

      // Tải lại danh sách tài liệu
      dispatch(getProjectDocumentList(selectedProject.id));
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Tải lên tài liệu thất bại: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setUploadLoading(false);
    }
  };

  // Xử lý thay đổi file trong upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <StyledDrawer
      width={window.innerWidth > 768 ? 1000 : '100%'}
      title={
        <Space align="center">
          <AnimatedAvatar
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
          <AnimatedButton type="primary" icon={<FileOutlined />}>
            Xuất báo cáo
          </AnimatedButton>
        </Space>
      }
    >
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flexDirection: 'column',
            padding: '40px 0',
          }}
        >
          <Spin size="large" tip="Đang tải thông tin dự án..." />
          <div
            style={{
              marginTop: '20px',
              width: '200px',
              height: '10px',
              borderRadius: '5px',
              background: 'linear-gradient(to right, #f0f0f0, #e0e0e0, #f0f0f0)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
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
      )}{' '}
      {/* Modal xem trước tài liệu */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width="90%"
        style={{ top: 20 }}
        title={
          <Space align="center">
            {currentDocument && getDocumentIcon(currentDocument.type || 'unknown')}
            <Text strong style={{ fontSize: 16 }}>
              {currentDocument ? currentDocument.name : 'Xem tài liệu'}
            </Text>
          </Space>
        }
        footer={[
          <AnimatedButton
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => currentDocument && downloadFile(currentDocument.url, currentDocument.name)}
          >
            Tải xuống
          </AnimatedButton>,
          <AnimatedButton key="close" onClick={() => setPreviewVisible(false)}>
            Đóng
          </AnimatedButton>,
        ]}
        className="document-preview-modal"
      >
        {currentDocument && <DocumentPreview document={currentDocument} onDownload={downloadFile} />}
      </Modal>{' '}
      {/* Modal tải lên tài liệu */}{' '}
      <Modal
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        width="600px"
        title={
          <Space>
            <UploadOutlined style={{ color: themeColors.primary, fontSize: 20 }} />
            <span style={{ fontWeight: 500 }}>Tải lên tài liệu dự án</span>
          </Space>
        }
        footer={[
          <AnimatedButton key="cancel" onClick={() => setUploadModalVisible(false)}>
            Huỷ
          </AnimatedButton>,
          <AnimatedButton
            key="upload"
            type="primary"
            loading={uploadLoading}
            onClick={handleUpload}
            disabled={fileList.length === 0}
          >
            Tải lên
          </AnimatedButton>,
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <Upload.Dragger
            fileList={fileList}
            onChange={handleFileChange}
            multiple
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
              showDownloadIcon: false,
              removeIcon: <span style={{ color: themeColors.error }}>Xoá</span>,
            }}
            beforeUpload={() => false} // Prevent automatic upload
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: '48px', color: themeColors.primary }} />
            </p>
            <p className="ant-upload-text">Kéo thả tài liệu vào đây hoặc nhấp để chọn tệp</p>
            <p className="ant-upload-hint" style={{ color: themeColors.textSecondary }}>
              Hỗ trợ tải lên nhiều tệp cùng lúc
            </p>
          </Upload.Dragger>
        </div>
        <div
          style={{
            marginTop: '16px',
            color: themeColors.textSecondary,
            fontSize: 14,
            background: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: 500, color: themeColors.textPrimary }}>Lưu ý:</div>
          <p>• Định dạng hỗ trợ: PDF, DOC, XLS, JPG, PNG, TXT, GIF.</p>
          <p>• Kích thước tối đa: 10MB mỗi tệp.</p>
          <p>• Tài liệu sẽ được gắn với dự án hiện tại.</p>
        </div>
      </Modal>
    </StyledDrawer>
  );
}
