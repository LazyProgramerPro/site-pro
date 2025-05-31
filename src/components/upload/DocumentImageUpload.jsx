import { DeleteOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Image, List, notification, Space, Spin, Upload } from 'antd';
import { useEffect, useState } from 'react';

/**
 * Component tái sử dụng cho upload ảnh và tài liệu
 * @param {Object} props
 * @param {string} props.entityId - ID của entity (project, contract, etc.)
 * @param {string} props.entityType - Loại entity ('project', 'contract', 'addendum')
 * @param {Function} props.onUploadImage - Hàm upload ảnh
 * @param {Function} props.onUploadDocument - Hàm upload tài liệu
 * @param {Function} props.onDeleteImage - Hàm xóa ảnh
 * @param {Function} props.onDeleteDocument - Hàm xóa tài liệu
 * @param {Function} props.onLoadDocuments - Hàm load danh sách tài liệu
 * @param {boolean} props.showImageUpload - Hiển thị phần upload ảnh
 * @param {boolean} props.showDocumentUpload - Hiển thị phần upload tài liệu
 * @param {string} props.imageTitle - Tiêu đề phần upload ảnh
 * @param {string} props.documentTitle - Tiêu đề phần upload tài liệu
 * @param {Array} props.acceptedDocumentTypes - Các loại tài liệu chấp nhận
 * @param {string} props.documentAcceptAttribute - Thuộc tính accept cho input file
 */
export default function DocumentImageUpload({
  entityId,
  entityType = 'project',
  onUploadImage,
  onUploadDocument,
  onDeleteImage,
  onDeleteDocument,
  onLoadDocuments,
  showImageUpload = true,
  showDocumentUpload = true,
  imageTitle = 'Hình ảnh',
  documentTitle = 'Tài liệu',
  acceptedDocumentTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'],
  documentAcceptAttribute = '.pdf,.doc,.docx,.xls,.xlsx,.txt',
}) {
  // States
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Load documents khi component mount hoặc entityId thay đổi
  useEffect(() => {
    if (entityId && onLoadDocuments) {
      loadEntityDocuments();
    }
  }, [entityId]);

  // Function để load danh sách tài liệu và hình ảnh từ API
  const loadEntityDocuments = async () => {
    if (!entityId || !onLoadDocuments) return;

    setLoadingDocuments(true);
    try {
      const result = await onLoadDocuments(entityId);

      if (result?.childDocs && result.childDocs.length > 0) {
        // Phân loại tài liệu thành images và documents
        const images = [];
        const documents = [];

        result.childDocs.forEach((item) => {
          // Kiểm tra file type để phân loại
          const isImage = item.doc.extension && item.doc.extension.match(/(jpg|jpeg|png|gif|bmp)$/i);

          if (isImage) {
            const imageUrl = debugImageUrl(item.doc.url, item.doc.name);
            images.push({
              id: item.doc.id,
              name: item.doc.name,
              url: imageUrl,
              status: 'done',
            });
          } else {
            documents.push({
              id: item.doc.id,
              name: item.doc.name,
              url: item.doc.url,
              status: 'done',
              size: item.doc.file_size ? (item.doc.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A',
            });
          }
        });

        setUploadedImages(images);
        setUploadedDocuments(documents);
      } else {
        setUploadedImages([]);
        setUploadedDocuments([]);
      }
    } catch (error) {
      setUploadedImages([]);
      setUploadedDocuments([]);
      console.error('Error loading documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Enhanced debug function để kiểm tra URL hình ảnh
  const debugImageUrl = (url, name) => {
    try {
      if (url) {
        const urlObj = new URL(url);
      }
    } catch (e) {
      // URL parsing failed
    }
    return url;
  };

  // Component để hiển thị hình ảnh với error handling
  const EntityImageDisplay = ({ image, size = 'small' }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Size configurations
    const sizeConfig = {
      small: { width: 48, height: 48, fallbackFontSize: '9px' },
      large: { width: 160, height: 120, fallbackFontSize: '12px' },
    };

    const currentSize = sizeConfig[size] || sizeConfig.small;

    // Validate URL
    const isValidUrl = (url) => {
      if (!url || url === 'null' || url === 'undefined' || url === '') {
        return false;
      }
      try {
        const urlObj = new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    };

    const handleImageError = () => {
      setImageError(true);
      setIsLoading(false);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
      setIsLoading(false);
    };

    const handleImageLoadStart = () => {
      setIsLoading(true);
    };

    // Fallback component
    const ImageFallback = ({ message, bgColor = '#f5f5f5' }) => (
      <div
        style={{
          width: currentSize.width,
          height: currentSize.height,
          background: bgColor,
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: currentSize.fallbackFontSize,
          color: '#999',
          textAlign: 'center',
          lineHeight: '1.2',
          padding: '8px',
        }}
      >
        {message}
      </div>
    );

    if (!isValidUrl(image.url)) {
      return <ImageFallback message="URL không hợp lệ" bgColor="#fff2e8" />;
    }

    if (imageError) {
      return <ImageFallback message="Lỗi tải ảnh" bgColor="#fff1f0" />;
    }

    return (
      <div style={{ position: 'relative', width: currentSize.width, height: currentSize.height }}>
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: currentSize.width,
              height: currentSize.height,
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              backdropFilter: 'blur(2px)',
            }}
          >
            <Spin size={size === 'large' ? 'default' : 'small'} />
          </div>
        )}
        <Image
          src={image.url}
          alt={image.name || `${entityType} Image`}
          width={currentSize.width}
          height={currentSize.height}
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          preview={{
            mask: (
              <div style={{ color: 'white', fontSize: '12px', textAlign: 'center' }}>
                <div>🔍 Xem ảnh</div>
                {imageLoaded && size === 'large' && (
                  <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>{image.name}</div>
                )}
              </div>
            ),
            src: image.url,
          }}
        />
      </div>
    );
  };

  // Upload handlers
  const handleImageUpload = async (file) => {
    if (!entityId) {
      notification.error({
        message: 'Lỗi',
        description: `Vui lòng lưu ${entityType} trước khi upload hình ảnh`,
      });
      return false;
    }

    if (!onUploadImage) {
      notification.error({
        message: 'Lỗi',
        description: 'Chức năng upload ảnh chưa được cấu hình',
      });
      return false;
    }

    setUploadingImage(true);
    try {
      await onUploadImage(file, entityId);
      // Reload danh sách tài liệu từ API để cập nhật
      await loadEntityDocuments();

      notification.success({
        message: 'Thành công',
        description: 'Upload hình ảnh thành công',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi upload',
        description: error?.message || 'Không thể upload hình ảnh',
      });
    } finally {
      setUploadingImage(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleDocumentUpload = async (file) => {
    if (!entityId) {
      notification.error({
        message: 'Lỗi',
        description: `Vui lòng lưu ${entityType} trước khi upload tài liệu`,
      });
      return false;
    }

    if (!onUploadDocument) {
      notification.error({
        message: 'Lỗi',
        description: 'Chức năng upload tài liệu chưa được cấu hình',
      });
      return false;
    }

    setUploadingDocument(true);
    try {
      await onUploadDocument(file, entityId);
      // Reload danh sách tài liệu từ API để cập nhật
      await loadEntityDocuments();

      notification.success({
        message: 'Thành công',
        description: 'Upload tài liệu thành công',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi upload',
        description: error?.message || 'Không thể upload tài liệu',
      });
    } finally {
      setUploadingDocument(false);
    }

    return false; // Prevent default upload behavior
  };

  const handleImageDelete = async (imageId) => {
    if (!entityId || !onDeleteImage) return;

    try {
      await onDeleteImage(imageId, entityId);
      // Reload danh sách tài liệu từ API để cập nhật
      await loadEntityDocuments();

      notification.success({
        message: 'Thành công',
        description: 'Xóa hình ảnh thành công',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Không thể xóa hình ảnh',
      });
    }
  };

  const handleDocumentDelete = async (documentId) => {
    if (!entityId || !onDeleteDocument) return;

    try {
      await onDeleteDocument(documentId, entityId);
      // Reload danh sách tài liệu từ API để cập nhật
      await loadEntityDocuments();

      notification.success({
        message: 'Thành công',
        description: 'Xóa tài liệu thành công',
      });
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Không thể xóa tài liệu',
      });
    }
  };

  return (
    <>
      <style>
        {`
          .ant-image-img {
            transition: all 0.3s ease;
          }
          .ant-image-img:hover {
            transform: scale(1.05);
          }
          .ant-image-img[src=""],
          .ant-image-img[src*="undefined"],
          .ant-image-img[src*="null"] {
            display: none !important;
          }
          .ant-image-img[src=""]:after,
          .ant-image-img[src*="undefined"]:after,
          .ant-image-img[src*="null"]:after {
            content: "Không có ảnh";
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            background: #f5f5f5;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 10px;
            color: #999;
          }
        `}
      </style>

      {/* Phần upload hình ảnh */}
      {showImageUpload && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            <Space>
              <span>{imageTitle}</span>
              {uploadingImage && <LoadingOutlined />}
            </Space>
          </label>

          <Upload.Dragger
            beforeUpload={handleImageUpload}
            showUploadList={false}
            disabled={uploadingImage || !entityId}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {uploadingImage ? 'Đang upload...' : 'Kéo thả hoặc nhấp để tải lên hình ảnh'}
            </p>
            <p className="ant-upload-hint">Chỉ cho phép upload 1 file mỗi lần. Chấp nhận file ảnh (JPG, PNG, GIF...)</p>
          </Upload.Dragger>

          {loadingDocuments ? (
            <Card title="Đang tải hình ảnh..." size="small">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="default" />
              </div>
            </Card>
          ) : (
            uploadedImages.length > 0 && (
              <Card title="Hình ảnh đã upload" size="small">
                <List
                  dataSource={uploadedImages}
                  renderItem={(image) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleImageDelete(image.id)}
                          danger
                          size="small"
                        >
                          Xóa
                        </Button>,
                      ]}
                      extra={<EntityImageDisplay image={image} size="small" />}
                    >
                      <List.Item.Meta
                        title={image.name || 'Không có tên'}
                        description={`Hình ảnh ${entityType} • ID: ${image.id}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )
          )}
        </div>
      )}

      {/* Phần upload tài liệu */}
      {showDocumentUpload && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            <Space>
              <span>{documentTitle}</span>
              {uploadingDocument && <LoadingOutlined />}
            </Space>
          </label>

          <Upload.Dragger
            beforeUpload={handleDocumentUpload}
            accept={documentAcceptAttribute}
            showUploadList={false}
            disabled={uploadingDocument || !entityId}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {uploadingDocument ? 'Đang upload...' : 'Kéo thả hoặc nhấp để tải lên tài liệu'}
            </p>
            <p className="ant-upload-hint">
              Chỉ cho phép upload 1 file mỗi lần. Chấp nhận các định dạng:{' '}
              {acceptedDocumentTypes.join(', ').toUpperCase()}
            </p>
          </Upload.Dragger>

          {loadingDocuments ? (
            <Card title="Đang tải tài liệu..." size="small">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="default" />
              </div>
            </Card>
          ) : (
            uploadedDocuments.length > 0 && (
              <Card title="Tài liệu đã upload" size="small">
                <List
                  dataSource={uploadedDocuments}
                  renderItem={(document) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDocumentDelete(document.id)}
                          danger
                          size="small"
                        >
                          Xóa
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={document.name}
                        description={`Tài liệu ${entityType} • ${document.size || 'N/A'}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )
          )}
        </div>
      )}
    </>
  );
}
