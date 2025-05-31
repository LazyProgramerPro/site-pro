import {
  DeleteOutlined,
  InboxOutlined,
  LoadingOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, List, notification, Space, Spin, Upload, Modal, Tooltip } from 'antd';
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
  entityType = 'Dự án',
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
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [documentPreviewVisible, setDocumentPreviewVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);

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
      console.log('API Response:', result); // Debug log

      if (result?.childDocs && Array.isArray(result.childDocs) && result.childDocs.length > 0) {
        // Phân loại tài liệu thành images và documents
        const images = [];
        const documents = [];

        result.childDocs.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item); // Debug log

          // Kiểm tra cấu trúc dữ liệu
          if (!item?.doc) {
            console.warn(`Item ${index} không có thuộc tính doc:`, item);
            return;
          }

          const doc = item.doc;

          // Kiểm tra file type để phân loại - cải thiện logic
          const extension = doc.extension?.toLowerCase() || '';
          const fileName = doc.name?.toLowerCase() || '';

          // Kiểm tra extension hoặc từ tên file
          const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
          const isImage =
            imageExtensions.includes(extension) || imageExtensions.some((ext) => fileName.endsWith(`.${ext}`));

          if (isImage) {
            const imageUrl = debugImageUrl(doc.url, doc.name);
            const imageItem = {
              id: doc.id,
              name: doc.name || `Image_${doc.id}`,
              url: imageUrl,
              status: 'done',
            };
            console.log('Adding image:', imageItem); // Debug log
            images.push(imageItem);
          } else {
            const documentItem = {
              id: doc.id,
              name: doc.name || `Document_${doc.id}`,
              url: doc.url,
              status: 'done',
              size: doc.file_size ? (doc.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A',
              extension: extension,
            };
            console.log('Adding document:', documentItem); // Debug log
            documents.push(documentItem);
          }
        });

        console.log('Final images:', images); // Debug log
        console.log('Final documents:', documents); // Debug log

        setUploadedImages(images);
        setUploadedDocuments(documents);
        setPreviewImages(images); // Cập nhật danh sách ảnh cho preview
      } else {
        console.log('No childDocs found or empty array'); // Debug log
        setUploadedImages([]);
        setUploadedDocuments([]);
        setPreviewImages([]);
      }
    } catch (error) {
      setUploadedImages([]);
      setUploadedDocuments([]);
      setPreviewImages([]);
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

  // Function để lấy icon cho từng loại file
  const getFileIcon = (fileName) => {
    if (!fileName) return <FileOutlined />;

    const extension = fileName.toLowerCase().split('.').pop();

    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'txt':
        return <FileTextOutlined style={{ color: '#722ed1' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <FileImageOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  // Function để kiểm tra file có thể preview được không
  const canPreviewDocument = (fileName) => {
    if (!fileName) return false;

    const extension = fileName.toLowerCase().split('.').pop();
    const previewableTypes = ['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'bmp'];

    return previewableTypes.includes(extension);
  };

  // Function để mở preview ảnh
  const openImagePreview = (imageIndex) => {
    setCurrentImageIndex(imageIndex);
    setPreviewVisible(true);
  };

  // Function để mở preview document
  const openDocumentPreview = (document) => {
    setCurrentDocument(document);
    setDocumentPreviewVisible(true);
  };

  // Function để download file
  const downloadFile = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Component để hiển thị hình ảnh với error handling
  const EntityImageDisplay = ({ image, size = 'small', onClick }) => {
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
      <div
        style={{
          position: 'relative',
          width: currentSize.width,
          height: currentSize.height,
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
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
        <div
          style={{
            width: currentSize.width,
            height: currentSize.height,
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <img
            src={image.url}
            alt={image.name || `${entityType} Image`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.3s ease',
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
            onLoadStart={handleImageLoadStart}
          />
          {onClick && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'all 0.3s ease',
                borderRadius: '8px',
              }}
              className="image-overlay"
            >
              <EyeOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
          )}
        </div>
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
          .image-overlay:hover {
            opacity: 1 !important;
            background: rgba(0, 0, 0, 0.5) !important;
          }
          .document-item {
            transition: all 0.3s ease;
          }
          .document-item:hover {
            background: #f5f5f5;
            border-radius: 8px;
          }
          .document-actions {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .preview-modal .ant-modal-body {
            padding: 0;
          }
          .document-preview-container {
            width: 100%;
            height: 70vh;
            border: none;
            border-radius: 8px;
          }
          .image-gallery {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .image-gallery-main {
            max-width: 100%;
            max-height: 70vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          .image-gallery-thumbnails {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            padding: 16px;
            max-width: 100%;
            overflow-x: auto;
          }
          .image-gallery-thumb {
            width: 60px;
            height: 60px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }
          .image-gallery-thumb:hover {
            border-color: #1890ff;
            transform: scale(1.05);
          }
          .image-gallery-thumb.active {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }
          .image-gallery-info {
            text-align: center;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-top: 16px;
          }
          .debug-info {
            background: #f0f2ff;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 16px;
            font-size: 12px;
            color: #666;
          }
        `}
      </style>

      {/* Debug info - chỉ hiển thị khi có entityId */}
      {entityId && (
        <div className="debug-info">
          <div>
            <strong>Debug Info:</strong>
          </div>
          <div>Entity ID: {entityId}</div>
          <div>Entity Type: {entityType}</div>
          <div>Loading: {loadingDocuments ? 'Yes' : 'No'}</div>
          <div>Images: {uploadedImages.length}</div>
          <div>Documents: {uploadedDocuments.length}</div>
          <div>onLoadDocuments function: {onLoadDocuments ? 'Available' : 'Not provided'}</div>
        </div>
      )}
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
          </Upload.Dragger>{' '}
          {loadingDocuments ? (
            <Card title="Đang tải hình ảnh..." size="small">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="default" />
              </div>
            </Card>
          ) : uploadedImages.length > 0 ? (
            <Card title="Hình ảnh đã upload" size="small">
              <List
                dataSource={uploadedImages}
                renderItem={(image, index) => (
                  <List.Item
                    className="document-item"
                    actions={[
                      <div className="document-actions" key="actions">
                        <Tooltip title="Xem ảnh">
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => openImagePreview(index)}
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Tải xuống">
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={() => downloadFile(image.url, image.name)}
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Xóa ảnh">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleImageDelete(image.id)}
                            danger
                            size="small"
                          />
                        </Tooltip>
                      </div>,
                    ]}
                    extra={<EntityImageDisplay image={image} size="small" onClick={() => openImagePreview(index)} />}
                  >
                    <List.Item.Meta
                      title={image.name || 'Không có tên'}
                      description={`Hình ảnh ${entityType} • ID: ${image.id}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          ) : entityId ? (
            <Card title="Hình ảnh" size="small">
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <div>Chưa có hình ảnh nào được upload</div>
              </div>
            </Card>
          ) : null}
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
          </Upload.Dragger>{' '}
          {loadingDocuments ? (
            <Card title="Đang tải tài liệu..." size="small">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="default" />
              </div>
            </Card>
          ) : uploadedDocuments.length > 0 ? (
            <Card title="Tài liệu đã upload" size="small">
              <List
                dataSource={uploadedDocuments}
                renderItem={(document) => (
                  <List.Item
                    className="document-item"
                    actions={[
                      <div className="document-actions" key="actions">
                        {canPreviewDocument(document.name) && (
                          <Tooltip title="Xem tài liệu">
                            <Button
                              type="text"
                              icon={<EyeOutlined />}
                              onClick={() => openDocumentPreview(document)}
                              size="small"
                            />
                          </Tooltip>
                        )}
                        <Tooltip title="Tải xuống">
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            onClick={() => downloadFile(document.url, document.name)}
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Xóa tài liệu">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDocumentDelete(document.id)}
                            danger
                            size="small"
                          />
                        </Tooltip>
                      </div>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getFileIcon(document.name)}
                      title={document.name}
                      description={`Tài liệu ${entityType} • ${document.size || 'N/A'}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          ) : entityId ? (
            <Card title="Tài liệu" size="small">
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <div>Chưa có tài liệu nào được upload</div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
      {/* Modal Preview Hình ảnh như Photo Viewer */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="90vw"
        className="preview-modal"
        title={
          <div style={{ textAlign: 'center' }}>
            <span>
              Xem ảnh ({currentImageIndex + 1}/{previewImages.length})
            </span>
          </div>
        }
      >
        {previewImages.length > 0 && previewImages[currentImageIndex] && (
          <div className="image-gallery">
            <img
              src={previewImages[currentImageIndex].url}
              alt={previewImages[currentImageIndex].name}
              className="image-gallery-main"
            />

            <div className="image-gallery-info">
              <h4 style={{ margin: '0 0 8px 0' }}>{previewImages[currentImageIndex].name}</h4>
              <p style={{ margin: 0, color: '#666' }}>
                Ảnh {currentImageIndex + 1} của {previewImages.length} • ID: {previewImages[currentImageIndex].id}
              </p>
            </div>

            {previewImages.length > 1 && (
              <div className="image-gallery-thumbnails">
                {previewImages.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={img.name}
                    className={`image-gallery-thumb ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
      {/* Modal Preview Tài liệu */}
      <Modal
        open={documentPreviewVisible}
        footer={[
          <Button
            key="download"
            icon={<DownloadOutlined />}
            onClick={() => currentDocument && downloadFile(currentDocument.url, currentDocument.name)}
          >
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setDocumentPreviewVisible(false)}>
            Đóng
          </Button>,
        ]}
        onCancel={() => setDocumentPreviewVisible(false)}
        width="90vw"
        className="preview-modal"
        title={currentDocument ? `Xem tài liệu: ${currentDocument.name}` : 'Xem tài liệu'}
      >
        {currentDocument && (
          <div style={{ width: '100%', height: '70vh' }}>
            {currentDocument.name.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${currentDocument.url}#view=FitH`}
                className="document-preview-container"
                title={currentDocument.name}
              />
            ) : currentDocument.name.toLowerCase().endsWith('.txt') ? (
              <iframe
                src={currentDocument.url}
                className="document-preview-container"
                title={currentDocument.name}
                style={{ backgroundColor: 'white' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getFileIcon(currentDocument.name)}</div>
                <h3>{currentDocument.name}</h3>
                <p style={{ color: '#666', marginBottom: '24px' }}>Không thể xem trước loại file này</p>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(currentDocument.url, currentDocument.name)}
                >
                  Tải xuống để xem
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
