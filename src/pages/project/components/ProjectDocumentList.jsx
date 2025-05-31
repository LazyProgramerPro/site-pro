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
import { Badge, Button, Card, Empty, Space, Spin, Tag, Tooltip } from 'antd';
import { useState } from 'react';
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

/**
 * Component hiển thị danh sách tài liệu dự án có thể tái sử dụng
 * @param {Object} props
 * @param {Array} props.documents - Danh sách tài liệu
 * @param {boolean} props.loading - Trạng thái loading
 * @param {string} props.title - Tiêu đề card (mặc định: "Tài liệu")
 * @param {string} props.entityType - Loại entity (mặc định: "dự án")
 * @param {boolean} props.showUploadButton - Hiển thị nút upload (mặc định: true)
 * @param {Function} props.onUpload - Callback khi click upload
 * @param {Function} props.onPreview - Callback khi click xem trước
 * @param {Function} props.onDownload - Callback khi click tải xuống
 * @param {Function} props.formatDate - Hàm format ngày tháng
 * @param {Function} props.getFilteredAndSortedDocuments - Hàm lọc và sắp xếp tài liệu
 */
export default function ProjectDocumentList({
  documents = [],
  loading = false,
  title = 'Tài liệu',
  entityType = 'dự án',
  showUploadButton = true,
  onUpload,
  onPreview,
  onDownload,
  formatDate,
  getFilteredAndSortedDocuments,
}) {
  // Hàm lấy icon tài liệu
  const getDocumentIcon = (type) => {
    const iconStyle = {
      fontSize: 32,
      marginRight: 12,
      transition: 'transform 0.3s ease',
    };

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
  };

  // Xử lý danh sách tài liệu được lọc và sắp xếp
  const processedDocuments = getFilteredAndSortedDocuments ? getFilteredAndSortedDocuments(documents) : documents;

  return (
    <StyledCard
      title={
        <Space>
          <FileOutlined style={{ color: themeColors.primary }} />
          <span>{title}</span>
          <StyledBadge count={documents.length} style={{ backgroundColor: themeColors.primary }} />
        </Space>
      }
      extra={
        showUploadButton &&
        onUpload && (
          <AnimatedButton type="primary" icon={<UploadOutlined />} onClick={onUpload}>
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
            <DocumentListItem key={index} onClick={() => onPreview && onPreview(doc)}>
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
                      {doc.date && formatDate && <span>Ngày tạo: {formatDate(doc.date)}</span>}
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
                      onPreview && onPreview(doc);
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
                      onDownload && onDownload(doc.url, doc.name);
                    }}
                  />
                </Tooltip>
              </div>
            </DocumentListItem>
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
  );
}
