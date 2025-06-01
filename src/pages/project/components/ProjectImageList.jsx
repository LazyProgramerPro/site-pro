import { DownloadOutlined, EyeOutlined, FileImageOutlined, UploadOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Empty, Modal, Space, Spin, Tag, Tooltip, Typography, Upload, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

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

// =============================================
// 1. COMPONENT IMAGE ICON
// =============================================
const ImageIcon = ({ className }) => {
  const iconStyle = {
    fontSize: 32,
    marginRight: 12,
    transition: 'transform 0.3s ease',
    color: '#52c41a',
  };

  return (
    <div className={className}>
      <FileImageOutlined style={iconStyle} />
    </div>
  );
};

// =============================================
// 2. COMPONENT IMAGE UPLOAD FORM
// =============================================
const ImageUploadForm = ({ fileList, onFileChange, entityType }) => (
  <div style={{ padding: '16px 0' }}>
    <Upload.Dragger
      fileList={fileList}
      onChange={onFileChange}
      multiple
      showUploadList={{
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: false,
        removeIcon: <span style={{ color: themeColors.error }}>Xoá</span>,
      }}
      beforeUpload={() => false}
      accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
      listType="picture"
    >
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <FileImageOutlined style={{ fontSize: 48, color: themeColors.primary, marginBottom: 16 }} />
        <div style={{ fontSize: 16, marginBottom: 8 }}>
          Kéo thả hình ảnh vào đây hoặc <span style={{ color: themeColors.primary }}>nhấp để chọn hình ảnh</span>
        </div>
        <div style={{ fontSize: 14, color: themeColors.textSecondary }}>
          Hỗ trợ định dạng: JPG, JPEG, PNG, GIF, BMP, WEBP
        </div>
      </div>
    </Upload.Dragger>

    <div style={{ marginTop: 16, padding: 16, backgroundColor: themeColors.background, borderRadius: 8 }}>
      <Text strong style={{ color: themeColors.primary }}>
        Lưu ý:
      </Text>
      <p>• Định dạng hỗ trợ: JPG, JPEG, PNG, GIF, BMP, WEBP.</p>
      <p>• Kích thước tối đa: 10MB mỗi hình ảnh.</p>
      <p>• Hình ảnh sẽ được gắn với {entityType} hiện tại.</p>
    </div>
  </div>
);

// =============================================
// 3. COMPONENT IMAGE UPLOAD MODAL
// =============================================
const ImageUploadModal = ({ visible, onCancel, onUpload, uploadLoading, fileList, onFileChange, entityType }) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    width="600px"
    title={
      <Space>
        <FileImageOutlined style={{ color: themeColors.primary, fontSize: 20 }} />
        <span style={{ fontWeight: 500 }}>Tải lên hình ảnh {entityType}</span>
      </Space>
    }
    footer={[
      <AnimatedButton key="cancel" onClick={onCancel}>
        Huỷ
      </AnimatedButton>,
      <AnimatedButton
        key="upload"
        type="primary"
        loading={uploadLoading}
        onClick={onUpload}
        disabled={fileList.length === 0}
      >
        Tải lên
      </AnimatedButton>,
    ]}
  >
    <ImageUploadForm fileList={fileList} onFileChange={onFileChange} entityType={entityType} />
  </Modal>
);

// =============================================
// 4. COMPONENT IMAGE PREVIEW
// =============================================
const ImagePreview = ({ image, onDownload }) => {
  const renderPreviewContent = useMemo(() => {
    if (!image) {
      return (
        <Empty
          description="Không có hình ảnh để xem trước"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '40px 0' }}
        />
      );
    }

    if (!image.url) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <FileImageOutlined style={{ fontSize: '64px', color: themeColors.error }} />
          </div>
          <Title level={4}>Không thể xem trước hình ảnh</Title>
          <Paragraph>URL hình ảnh không hợp lệ hoặc bị thiếu</Paragraph>
        </div>
      );
    }

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
            src={image.url}
            alt={image.name}
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
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Không+thể+tải+ảnh';
            }}
          />
        </div>
        <Space>
          <AnimatedButton icon={<DownloadOutlined />} onClick={() => onDownload(image.url, image.name)}>
            Tải xuống
          </AnimatedButton>
          <AnimatedButton type="primary" icon={<EyeOutlined />} onClick={() => window.open(image.url, '_blank')}>
            Xem trong tab mới
          </AnimatedButton>
        </Space>
      </div>
    );
  }, [image, onDownload]);

  return renderPreviewContent;
};

// =============================================
// 5. COMPONENT IMAGE PREVIEW MODAL
// =============================================
const ImagePreviewModal = ({ visible, onCancel, image, onDownload }) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    width="90%"
    style={{ top: 20, maxWidth: '1200px' }}
    title={
      <Space>
        <EyeOutlined style={{ color: themeColors.primary, fontSize: 20 }} />
        <span style={{ fontWeight: 500 }}>{image?.name || 'Xem trước hình ảnh'}</span>
      </Space>
    }
    footer={[
      <AnimatedButton
        key="download"
        type="primary"
        icon={<DownloadOutlined />}
        onClick={() => image && onDownload(image.url, image.name)}
      >
        Tải xuống
      </AnimatedButton>,
      <AnimatedButton key="close" onClick={onCancel}>
        Đóng
      </AnimatedButton>,
    ]}
    className="image-preview-modal"
  >
    <ImagePreview image={image} onDownload={onDownload} />
  </Modal>
);

// =============================================
// 6. COMPONENT IMAGE ITEM
// =============================================
const ImageItem = ({ image, formatDate, onPreview, onDownload }) => (
  <ImageListItem onClick={() => onPreview(image)}>
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
            onPreview(image);
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
            onDownload(image.url, image.name);
          }}
        />
      </Tooltip>
    </div>
  </ImageListItem>
);

/**
 * Component hiển thị danh sách hình ảnh dự án có thể tái sử dụng
 * @param {Object} props
 * @param {Array} props.images - Danh sách hình ảnh
 * @param {boolean} props.loading - Trạng thái loading
 * @param {string} props.title - Tiêu đề card (mặc định: "Hình ảnh")
 * @param {string} props.entityType - Loại entity (mặc định: "dự án")
 * @param {boolean} props.showUploadButton - Hiển thị nút upload (mặc định: true)
 * @param {Function} props.onUpload - Callback khi click upload (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.onPreview - Callback khi click xem trước (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.onDownload - Callback khi click tải xuống (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.formatDate - Hàm format ngày tháng
 * @param {Function} props.getFilteredAndSortedImages - Hàm lọc và sắp xếp hình ảnh
 * @param {Object} props.selectedEntity - Entity hiện tại (dự án, hợp đồng, v.v.)
 * @param {Function} props.uploadImageThunk - Redux thunk để upload hình ảnh
 * @param {Function} props.getImageListThunk - Redux thunk để lấy danh sách hình ảnh
 * @param {Function} props.dispatch - Redux dispatch function
 */
export default function ProjectImageList({
  images = [],
  loading = false,
  title = 'Hình ảnh',
  entityType = 'dự án',
  showUploadButton = true,
  onUpload, // Legacy callback - deprecated
  onPreview, // Legacy callback - deprecated
  onDownload, // Legacy callback - deprecated
  formatDate,
  getFilteredAndSortedImages,
  selectedEntity, // Entity hiện tại (dự án, hợp đồng, v.v.)
  uploadImageThunk, // Redux thunk để upload hình ảnh
  getImageListThunk, // Redux thunk để lấy danh sách hình ảnh
  dispatch, // Redux dispatch function
}) {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================

  // Function để map entity type với tên tham số trong Redux thunk
  const getEntityIdParamName = useCallback((entityType) => {
    const entityParamMap = {
      'dự án': 'projectId',
      'hợp đồng': 'contractId',
      'phụ lục hợp đồng': 'contractAddendumId',
      'công trình': 'constructionId',
    };
    return entityParamMap[entityType.toLowerCase()] || 'entityId';
  }, []);

  // =============================================
  // MEMOIZED VALUES
  // =============================================
  const processedImages = useMemo(() => {
    return getFilteredAndSortedImages ? getFilteredAndSortedImages(images) : images;
  }, [images, getFilteredAndSortedImages]);

  // =============================================
  // CALLBACK HANDLERS
  // =============================================
  const handleImagePreview = useCallback((image) => {
    setCurrentImage(image);
    setPreviewVisible(true);
  }, []);

  const handleUploadModalShow = useCallback(() => {
    setFileList([]);
    setUploadModalVisible(true);
  }, []);

  const handleDownloadFile = useCallback((url, fileName) => {
    if (!url) {
      message.error('URL hình ảnh không hợp lệ');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('Không thể tải xuống hình ảnh');
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một hình ảnh để tải lên!');
      return;
    }

    if (!selectedEntity?.id || !uploadImageThunk || !dispatch) {
      message.error('Thiếu thông tin cần thiết để tải lên hình ảnh');
      return;
    }

    setUploadLoading(true);
    try {
      const entityIdParamName = getEntityIdParamName(entityType);

      const uploadPromises = fileList.map((file) => {
        console.log('Uploading image:', file.name);
        console.log('Entity ID:', selectedEntity.id); // Debug log
        console.log('Entity param name:', entityIdParamName); // Debug log

        // Tạo đối tượng tham số chuẩn cho các thunk functions
        const uploadParams = {
          file: file.originFileObj,
          [entityIdParamName]: selectedEntity.id, // Dynamic property name dựa trên entity type
          parentId: null, // Có thể được config sau
          name: file.name,
          description: `Hình ảnh ${entityType} - ${file.name}`,
        };

        console.log('Upload params:', uploadParams); // Debug log

        return dispatch(uploadImageThunk(uploadParams));
      });

      await Promise.all(uploadPromises);

      message.success('Tải lên hình ảnh thành công!');
      setUploadModalVisible(false);
      setFileList([]);

      if (getImageListThunk) {
        dispatch(getImageListThunk(selectedEntity.id));
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Tải lên hình ảnh thất bại: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setUploadLoading(false);
    }
  }, [fileList, selectedEntity, uploadImageThunk, dispatch, entityType, getImageListThunk]);

  const handleFileChange = useCallback(({ fileList }) => {
    setFileList(fileList);
  }, []);

  const handleModalClose = useCallback(() => {
    setPreviewVisible(false);
    setCurrentImage(null);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setUploadModalVisible(false);
    setFileList([]);
  }, []);

  // =============================================
  // RENDER COMPONENT
  // =============================================
  return (
    <>
      <StyledCard
        title={
          <Space>
            <FileImageOutlined style={{ color: themeColors.primary }} />
            <span>{title}</span>
            <StyledBadge count={images.length} style={{ backgroundColor: themeColors.primary }} />
          </Space>
        }
        extra={
          showUploadButton && (
            <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={onUpload || handleUploadModalShow}>
              Tải lên hình ảnh
            </AnimatedButton>
          )
        }
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải hình ảnh..." />
          </div>
        ) : processedImages.length > 0 ? (
          <DocumentList>
            {processedImages.map((img, index) => (
              <ImageItem
                key={index}
                image={img}
                formatDate={formatDate}
                onPreview={onPreview || handleImagePreview}
                onDownload={onDownload || handleDownloadFile}
              />
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

      {/* Modal xem trước hình ảnh */}
      <ImagePreviewModal
        visible={previewVisible}
        onCancel={handleModalClose}
        image={currentImage}
        onDownload={handleDownloadFile}
      />

      {/* Modal tải lên hình ảnh */}
      <ImageUploadModal
        visible={uploadModalVisible}
        onCancel={handleUploadModalClose}
        onUpload={handleUpload}
        uploadLoading={uploadLoading}
        fileList={fileList}
        onFileChange={handleFileChange}
        entityType={entityType}
      />
    </>
  );
}
