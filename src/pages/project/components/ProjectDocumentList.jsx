import {
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  UploadOutlined,
} from '@ant-design/icons';
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

// =============================================
// 1. COMPONENT ICON HANDLER
// =============================================
const DocumentIcon = ({ type, className }) => {
  const iconStyle = {
    fontSize: 32,
    marginRight: 12,
    transition: 'transform 0.3s ease',
  };

  const getIcon = useMemo(() => {
    switch (type?.toLowerCase()) {
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
  }, [type]);

  return <div className={className}>{getIcon}</div>;
};

// =============================================
// 2. COMPONENT UPLOAD FORM
// =============================================
const DocumentUploadForm = ({ fileList, onFileChange, entityType }) => (
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
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
    >
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <UploadOutlined style={{ fontSize: 48, color: themeColors.primary, marginBottom: 16 }} />
        <div style={{ fontSize: 16, marginBottom: 8 }}>
          Kéo thả tệp vào đây hoặc <span style={{ color: themeColors.primary }}>nhấp để chọn tệp</span>
        </div>
        <div style={{ fontSize: 14, color: themeColors.textSecondary }}>
          Hỗ trợ định dạng: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF
        </div>
      </div>
    </Upload.Dragger>

    <div style={{ marginTop: 16, padding: 16, backgroundColor: themeColors.background, borderRadius: 8 }}>
      <Text strong style={{ color: themeColors.primary }}>
        Lưu ý:
      </Text>
      <p>• Định dạng hỗ trợ: PDF, DOC, XLS, JPG, PNG, TXT, GIF.</p>
      <p>• Kích thước tối đa: 10MB mỗi tệp.</p>
      <p>• Tài liệu sẽ được gắn với {entityType} hiện tại.</p>
    </div>
  </div>
);

// =============================================
// 3. COMPONENT UPLOAD MODAL
// =============================================
const DocumentUploadModal = ({ visible, onCancel, onUpload, uploadLoading, fileList, onFileChange, entityType }) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    width="600px"
    title={
      <Space>
        <UploadOutlined style={{ color: themeColors.primary, fontSize: 20 }} />
        <span style={{ fontWeight: 500 }}>Tải lên tài liệu {entityType}</span>
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
    <DocumentUploadForm fileList={fileList} onFileChange={onFileChange} entityType={entityType} />
  </Modal>
);

// =============================================
// 4. COMPONENT DOCUMENT PREVIEW
// =============================================
const DocumentPreview = ({ document, onDownload }) => {
  const isPreviewable = useCallback((doc) => {
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
  }, []);

  const renderPreviewContent = useMemo(() => {
    if (!document) {
      return (
        <Empty
          description="Không có tài liệu để xem trước"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '40px 0' }}
        />
      );
    }

    if (!document.url) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <FileUnknownOutlined style={{ fontSize: '64px', color: themeColors.error }} />
          </div>
          <Title level={4}>Không thể xem trước tài liệu</Title>
          <Paragraph>URL tài liệu không hợp lệ hoặc bị thiếu</Paragraph>
        </div>
      );
    }

    const lowerName = document.name.toLowerCase();
    const fileType = document.type || lowerName.split('.').pop();

    // PDF Preview
    if (lowerName.endsWith('.pdf')) {
      return (
        <div className="pdf-container" style={{ position: 'relative', height: '70vh' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
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
    }

    // Image Preview
    if (
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
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Không+thể+tải+ảnh';
              }}
            />
          </div>
          <Space>
            <AnimatedButton icon={<DownloadOutlined />} onClick={() => onDownload(document.url, document.name)}>
              Tải xuống
            </AnimatedButton>
            <AnimatedButton
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => window.open(document.url, '_blank', 'noopener')}
            >
              Xem trong tab mới
            </AnimatedButton>
          </Space>
        </div>
      );
    }

    // Default Preview (không thể xem trước)
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
          <DocumentIcon type={document.type || 'unknown'} />
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
            <AnimatedButton icon={<EyeOutlined />} onClick={() => window.open(document.url, '_blank', 'noopener')}>
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
  }, [document, onDownload]);

  return renderPreviewContent;
};

// =============================================
// 5. COMPONENT PREVIEW MODAL
// =============================================
const DocumentPreviewModal = ({ visible, onCancel, document, onDownload }) => (
  <Modal
    open={visible}
    onCancel={onCancel}
    width="90%"
    style={{ top: 20, maxWidth: '1200px' }}
    title={
      <Space>
        <EyeOutlined style={{ color: themeColors.primary, fontSize: 20 }} />
        <span style={{ fontWeight: 500 }}>{document?.name || 'Xem trước tài liệu'}</span>
      </Space>
    }
    footer={null}
    className="document-preview-modal"
  >
    <DocumentPreview document={document} onDownload={onDownload} />
  </Modal>
);

// =============================================
// 6. COMPONENT DOCUMENT ITEM
// =============================================
const DocumentItem = ({ document, formatDate, onPreview, onDownload }) => (
  <DocumentListItem onClick={() => onPreview(document)}>
    <div className="document-info">
      <DocumentIcon type={document.type} className="document-icon" />
      <div className="document-details">
        <Tooltip title={document.name}>
          <div className="document-title">{document.name}</div>
        </Tooltip>
        <div className="document-meta">
          <Space size="middle">
            <Tag color="blue">{document.type?.toUpperCase()}</Tag>
            {document.size && <span>{document.size}</span>}
            {document.date && formatDate && <span>Ngày tạo: {formatDate(document.date)}</span>}
            {document.creator && <span>Người tạo: {document.creator}</span>}
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
            onPreview(document);
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
            onDownload(document.url, document.name);
          }}
        />
      </Tooltip>
    </div>
  </DocumentListItem>
);

/**
 * Component hiển thị danh sách tài liệu dự án có thể tái sử dụng
 * @param {Object} props
 * @param {Array} props.documents - Danh sách tài liệu
 * @param {boolean} props.loading - Trạng thái loading
 * @param {string} props.title - Tiêu đề card (mặc định: "Tài liệu")
 * @param {string} props.entityType - Loại entity (mặc định: "dự án")
 * @param {boolean} props.showUploadButton - Hiển thị nút upload (mặc định: true)
 * @param {Function} props.onUpload - Callback khi click upload (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.onPreview - Callback khi click xem trước (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.onDownload - Callback khi click tải xuống (deprecated - sẽ được xử lý nội bộ)
 * @param {Function} props.formatDate - Hàm format ngày tháng
 * @param {Function} props.getFilteredAndSortedDocuments - Hàm lọc và sắp xếp tài liệu
 * @param {Object} props.selectedEntity - Entity hiện tại (dự án, hợp đồng, v.v.)
 * @param {Function} props.uploadDocumentThunk - Redux thunk để upload tài liệu
 * @param {Function} props.getDocumentListThunk - Redux thunk để lấy danh sách tài liệu
 * @param {Function} props.dispatch - Redux dispatch function
 */
export default function ProjectDocumentList({
  documents = [],
  loading = false,
  title = 'Tài liệu',
  entityType = 'dự án',
  showUploadButton = true,
  onUpload, // Legacy callback - deprecated
  onPreview, // Legacy callback - deprecated
  onDownload, // Legacy callback - deprecated
  formatDate,
  getFilteredAndSortedDocuments,
  selectedEntity, // Entity hiện tại (dự án, hợp đồng, v.v.)
  uploadDocumentThunk, // Redux thunk để upload tài liệu
  getDocumentListThunk, // Redux thunk để lấy danh sách tài liệu
  dispatch, // Redux dispatch function
}) {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
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
  const processedDocuments = useMemo(() => {
    return getFilteredAndSortedDocuments ? getFilteredAndSortedDocuments(documents) : documents;
  }, [documents, getFilteredAndSortedDocuments]);

  // =============================================
  // CALLBACK HANDLERS
  // =============================================
  const handleDocumentPreview = useCallback((document) => {
    setCurrentDocument(document);
    setPreviewVisible(true);
  }, []);

  const handleUploadModalShow = useCallback(() => {
    setFileList([]);
    setUploadModalVisible(true);
  }, []);

  const handleDownloadFile = useCallback(async (url, fileName) => {
    if (!url) {
      message.error('URL tài liệu không hợp lệ');
      return;
    }

    // Sử dụng phương pháp tạo link và click để mở/tải file
    const link = document.createElement('a');
    link.href = url;
    // Loại bỏ dòng sau để ưu tiên mở trong tab mới thay vì bắt buộc tải xuống:
    // link.download = fileName || 'document';
    link.target = '_blank'; // Mở trong tab mới nếu trình duyệt hỗ trợ
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  const handleUpload = useCallback(async () => {
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một tài liệu để tải lên!');
      return;
    }

    if (!selectedEntity?.id || !uploadDocumentThunk || !dispatch) {
      message.error('Thiếu thông tin cần thiết để tải lên tài liệu');
      return;
    }

    setUploadLoading(true);
    try {
      const entityIdParamName = getEntityIdParamName(entityType);

      const uploadPromises = fileList.map((file) => {
        console.log('Uploading file:', file.name);
        console.log('Entity ID:', selectedEntity.id); // Debug log
        console.log('Entity param name:', entityIdParamName); // Debug log

        // Tạo đối tượng tham số chuẩn cho các thunk functions
        const uploadParams = {
          file: file.originFileObj,
          [entityIdParamName]: selectedEntity.id, // Dynamic property name dựa trên entity type
          parentId: null, // Có thể được config sau
          name: file.name,
          description: `Tài liệu ${entityType} - ${file.name}`,
        };

        console.log('Upload params:', uploadParams); // Debug log

        return dispatch(uploadDocumentThunk(uploadParams));
      });

      await Promise.all(uploadPromises);

      message.success('Tải lên tài liệu thành công!');
      setUploadModalVisible(false);
      setFileList([]);

      if (getDocumentListThunk) {
        dispatch(getDocumentListThunk(selectedEntity.id));
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Tải lên tài liệu thất bại: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setUploadLoading(false);
    }
  }, [fileList, selectedEntity, uploadDocumentThunk, dispatch, entityType, getDocumentListThunk]);

  const handleFileChange = useCallback(({ fileList }) => {
    setFileList(fileList);
  }, []);

  const handleModalClose = useCallback(() => {
    setPreviewVisible(false);
    setCurrentDocument(null);
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
            <FileOutlined style={{ color: themeColors.primary }} />
            <span>{title}</span>
            <StyledBadge count={documents.length} style={{ backgroundColor: themeColors.primary }} />
          </Space>
        }
        extra={
          showUploadButton && (
            <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={onUpload || handleUploadModalShow}>
              Tải lên tài liệu
            </AnimatedButton>
          )
        }
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spin size="large" tip="Đang tải tài liệu..." />
          </div>
        ) : processedDocuments.length > 0 ? (
          <DocumentList>
            {processedDocuments.map((doc, index) => (
              <DocumentItem
                key={index}
                document={doc}
                formatDate={formatDate}
                onPreview={onPreview || handleDocumentPreview}
                onDownload={handleDownloadFile} // Luôn sử dụng handleDownloadFile nội bộ
              />
            ))}
          </DocumentList>
        ) : (
          <Empty
            description={`Chưa có tài liệu nào cho ${entityType} này`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '40px 0' }}
          />
        )}
      </StyledCard>

      {/* Modal xem trước tài liệu */}
      <DocumentPreviewModal
        visible={previewVisible}
        onCancel={handleModalClose}
        document={currentDocument}
        onDownload={handleDownloadFile}
      />

      {/* Modal tải lên tài liệu */}
      <DocumentUploadModal
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
