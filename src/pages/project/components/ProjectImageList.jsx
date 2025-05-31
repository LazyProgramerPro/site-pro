import { DownloadOutlined, EyeOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Empty, Space, Spin, Tag, Tooltip } from 'antd';
import styled from 'styled-components';

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

const AnimatedButton = styled(Button)`
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  transform-origin: 50% 50%;

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
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }
  }
`;

/**
 * Component hiển thị danh sách hình ảnh dự án có thể tái sử dụng
 * @param {Object} props
 * @param {Array} props.images - Danh sách hình ảnh
 * @param {boolean} props.loading - Trạng thái loading
 * @param {string} props.title - Tiêu đề card (mặc định: "Hình ảnh")
 * @param {string} props.entityType - Loại entity (mặc định: "dự án")
 * @param {boolean} props.showUploadButton - Hiển thị nút upload (mặc định: true)
 * @param {Function} props.onUpload - Callback khi click upload
 * @param {Function} props.onPreview - Callback khi click xem trước
 * @param {Function} props.onDownload - Callback khi click tải xuống
 * @param {Function} props.formatDate - Hàm format ngày tháng
 */
export default function ProjectImageList({
  images = [],
  loading = false,
  title = 'Hình ảnh',
  entityType = 'dự án',
  showUploadButton = true,
  onUpload,
  onPreview,
  onDownload,
  formatDate,
}) {
  return (
    <StyledCard
      title={
        <Space>
          <FileOutlined style={{ color: themeColors.primary }} />
          <span>{title}</span>
          <StyledBadge count={images.length} style={{ backgroundColor: themeColors.primary }} />
        </Space>
      }
      extra={
        showUploadButton &&
        onUpload && (
          <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={onUpload}>
            Tải lên hình ảnh
          </AnimatedButton>
        )
      }
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spin size="large" tip="Đang tải hình ảnh..." />
        </div>
      ) : images.length > 0 ? (
        <DocumentList>
          {images.map((image, index) => (
            <ImageListItem key={index} onClick={() => onPreview && onPreview(image)}>
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
                      {image.date && formatDate && <span>Ngày tạo: {formatDate(image.date)}</span>}
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
                      onPreview && onPreview(image);
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
                      onDownload && onDownload(image.url, image.name);
                    }}
                  />
                </Tooltip>
              </div>
            </ImageListItem>
          ))}
        </DocumentList>
      ) : (
        <Empty
          description={`Chưa có hình ảnh nào cho ${entityType} này`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '40px 0' }}
        />
      )}
    </StyledCard>
  );
}
