import { CloseCircleOutlined, DownloadOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Col, Drawer, Form, Row, Space, Typography, Upload, message, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../../../redux/store';
import { getContractAddendumList, importContractAddendumExcel } from '../redux/contractAddendum.slide';

const { Text } = Typography;

/**
 * Component Import Excel phụ lục hợp đồng
 * @param {Object} props
 * @param {Function} props.onClose - Hàm đóng drawer
 * @param {boolean} props.open - Trạng thái hiển thị drawer
 */

// Styled Components
const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 16px 24px;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-drawer-body {
    padding: 24px;
    background-color: #f7f9fc;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;

  .ant-card-body {
    padding: 20px;
  }
`;

const StyledUpload = styled(Upload.Dragger)`
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: #1890ff;
    background-color: #f0f5ff;
  }

  &.drag-active {
    border-color: #52c41a;
    background-color: #f6ffed;
  }

  .ant-upload-drag-icon {
    margin-bottom: 16px;
    .anticon {
      font-size: 48px;
      color: #1890ff;
      transition: all 0.3s ease;
    }
  }

  .ant-upload-text {
    font-size: 16px;
    font-weight: 500;
    color: #434343;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }

  .ant-upload-hint {
    color: #8c8c8c;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .ant-upload-list-item {
    transition: all 0.3s ease;
    margin-top: 8px;
    border-radius: 8px;
    padding: 4px 8px;
    background-color: #f5f5f5;

    &:hover {
      background-color: #e6f7ff;
    }

    .ant-upload-list-item-name {
      color: #1890ff;
      font-weight: 500;
    }

    .ant-upload-list-item-card-actions {
      opacity: 0.7;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
`;

const FormContainer = styled.div`
  .ant-form-item-label > label {
    font-weight: 500;
    color: #434343;
  }

  .ant-select {
    .ant-select-selector {
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      transition: all 0.3s;

      &:hover {
        border-color: #40a9ff;
      }
    }
  }
`;

const ActionButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

// Theme colors
const themeColors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  border: '#f0f0f0',
  background: '#fafafa',
};

const initialState = {};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const validateFile = (file) => {
  // Kiểm tra định dạng file
  const isExcel =
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.name.toLowerCase().endsWith('.xlsx') ||
    file.name.toLowerCase().endsWith('.xls');

  if (!isExcel) {
    message.error({
      content: 'Chỉ chấp nhận file Excel (.xlsx, .xls)!',
      key: 'fileTypeError',
      duration: 3,
    });
    return false;
  }

  // Kiểm tra dung lượng file
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error({
      content: `Dung lượng file ${(file.size / 1024 / 1024).toFixed(2)}MB vượt quá giới hạn 10MB!`,
      key: 'fileSizeError',
      duration: 3,
    });
    return false;
  }

  // Kiểm tra tên file
  if (file.name.length > 100) {
    message.warning({
      content: 'Tên file quá dài, có thể gây lỗi khi tải lên!',
      key: 'fileNameWarning',
      duration: 3,
    });
  }

  return true; // File hợp lệ
};

export default function ImportExcel(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const [fileList, setFileList] = useState([]);

  const loading = useSelector((state) => state.contractAddendum.loading);
  const selectedContract = useSelector((state) => state.contract.editingContract);
  const dispatch = useAppDispatch();

  // Reset form khi component mở
  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

  // Hàm tải xuống mẫu Excel
  const handleDownloadTemplate = () => {
    // Hiển thị thông báo đang tải xuống
    message.loading({
      content: 'Đang tải xuống mẫu Excel...',
      key: 'downloadTemplate',
      duration: 0,
    });

    try {
      // Gọi API để tải xuống mẫu Excel
      window.open('/api/auth/phuluchopdong/download-template', '_blank');

      // Hiển thị thông báo thành công sau khi mở tab mới
      setTimeout(() => {
        message.success({
          content: 'Đã tải xuống mẫu Excel phụ lục hợp đồng',
          key: 'downloadTemplate',
          duration: 3,
        });
      }, 1000);
    } catch (error) {
      console.error('Lỗi tải xuống mẫu Excel:', error);
      message.error({
        content: 'Không thể tải xuống mẫu Excel! Vui lòng thử lại.',
        key: 'downloadTemplate',
        duration: 3,
      });
    }
  };

  const onFinish = async (values) => {
    try {
      // Kiểm tra file được upload
      if (!values.contractExcel || values.contractExcel.length === 0) {
        message.error({
          content: 'Vui lòng chọn file Excel để import!',
          key: 'noFileError',
          duration: 3,
        });
        return;
      }

      const fileItem = values.contractExcel[0];
      // Lấy file từ originFileObj (AntD Upload component)
      const file = fileItem.originFileObj;

      if (!file) {
        message.error({
          content: 'Không tìm thấy file để upload!',
          key: 'missingFileError',
          duration: 3,
        });
        return;
      }

      // Kiểm tra lại file một lần nữa trước khi gửi
      if (!validateFile(file)) {
        return;
      }

      // Hiển thị thông báo đang xử lý
      message.loading({
        content: 'Đang xử lý file Excel...',
        key: 'uploadLoading',
        duration: 0,
      });

      // Gọi API import Excel thông qua thunk action
      const result = await dispatch(
        importContractAddendumExcel({
          file: file,
          description: 'Import Excel phụ lục hợp đồng',
        }),
      );

      // Luôn đảm bảo xóa thông báo đang xử lý sau khi có kết quả
      message.destroy('uploadLoading');

      if (importContractAddendumExcel.fulfilled.match(result)) {
        // Hiển thị thông báo thành công
        message.success({
          content: 'Import Excel thành công!',
          key: 'importSuccess',
          duration: 3,
        });

        // Reset form và đóng drawer
        form.resetFields();
        setFileList([]);
        onClose();

        // Refresh danh sách phụ lục hợp đồng với filter
        const filters = {
          pageNo: 0,
          pageSize: 10,
          searchText: '',
          du_an_id: selectedContract?.du_an_id,
          cong_trinh_id: selectedContract?.cong_trinh_id,
          hop_dong_id: selectedContract?.id,
        };
        dispatch(getContractAddendumList(filters));
      } else if (importContractAddendumExcel.rejected.match(result)) {
        // Hiển thị thông báo lỗi
        const errorMessage = result.payload || result.error?.message || 'Import Excel thất bại! Vui lòng thử lại.';
        message.error({
          content: errorMessage,
          key: 'importError',
          duration: 3,
        });
      }
    } catch (error) {
      console.error('Lỗi import Excel:', error);

      // Đảm bảo xóa thông báo đang xử lý trong trường hợp có lỗi
      message.destroy('uploadLoading');

      // Hiển thị thông báo lỗi
      message.error({
        content: error?.message || 'Import Excel thất bại! Vui lòng thử lại.',
        key: 'importError',
        duration: 3,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);

    // Hiển thị thông báo lỗi validation
    if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
      const firstError = errorInfo.errorFields[0];
      message.error({
        content: firstError.errors[0] || 'Vui lòng kiểm tra lại thông tin!',
        key: 'formValidationError',
        duration: 3,
      });
    }
  };

  // TODO: Xác nhận lại xem thêm cho hợp đồng
  return (
    <StyledDrawer
      width={window.innerWidth > 768 ? 600 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<FileExcelOutlined />}
            size="large"
            style={{
              backgroundColor: themeColors.success,
              boxShadow: '0 2px 8px rgba(82, 196, 26, 0.5)',
            }}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 18 }}>
              Import Excel phụ lục hợp đồng
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tải lên file Excel để tạo phụ lục hợp đồng
            </Text>
          </Space>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose} icon={<CloseCircleOutlined />}>
            Hủy
          </Button>
        </Space>
      }
    >
      <>
        {' '}
        <Alert
          message={
            <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span>Hướng dẫn Import Excel</span>
              <Button type="primary" size="small" icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
                Tải mẫu Excel
              </Button>
            </Space>
          }
          description="File Excel phải có định dạng phù hợp với template của hệ thống."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        <FormContainer>
          <Form
            name="form-excel-contract-addendum"
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <StyledCard
              title={
                <Space>
                  <FileExcelOutlined style={{ color: themeColors.success }} />
                  <span>File Excel phụ lục hợp đồng</span>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="File Excel"
                    name="contractExcel"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng upload file Excel',
                      },
                    ]}
                  >
                    {' '}
                    <StyledUpload
                      name="contractExcel"
                      multiple={false}
                      fileList={fileList}
                      beforeUpload={(file) => {
                        // Kiểm tra file hợp lệ
                        const isValid = validateFile(file);
                        if (isValid) {
                          // Cập nhật fileList để hiển thị file đã chọn
                          setFileList([
                            {
                              uid: file.uid || '-1',
                              name: file.name,
                              status: 'done',
                              size: file.size,
                              type: file.type,
                              originFileObj: file,
                            },
                          ]);
                          // Cập nhật giá trị form
                          form.setFieldsValue({
                            contractExcel: [
                              {
                                uid: file.uid || '-1',
                                name: file.name,
                                status: 'done',
                                size: file.size,
                                type: file.type,
                                originFileObj: file,
                              },
                            ],
                          });
                        }
                        // Luôn trả về false để ngăn chặn upload tự động
                        // và xử lý thông qua onFinish của Form
                        return false;
                      }}
                      accept=".xlsx,.xls"
                      maxCount={1}
                      showUploadList={{
                        showRemoveIcon: true,
                        showPreviewIcon: false,
                      }}
                      onRemove={() => {
                        setFileList([]);
                        form.setFieldsValue({ contractExcel: [] });
                        return true;
                      }}
                      onChange={(info) => {
                        // Cập nhật UI khi có thay đổi về file
                        const { status } = info.file;
                        if (status === 'removed') {
                          setFileList([]);
                        }
                      }}
                      onDrop={(e) => {
                        console.log('Dropped files', e.dataTransfer.files);
                        // Thêm class để styling khi drag
                        e.target.closest('.ant-upload-drag').classList.remove('drag-active');
                      }}
                      onDragOver={(e) => {
                        // Thêm class để styling khi drag
                        e.target.closest('.ant-upload-drag').classList.add('drag-active');
                      }}
                      onDragLeave={(e) => {
                        // Xóa class khi drag rời
                        e.target.closest('.ant-upload-drag').classList.remove('drag-active');
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <FileExcelOutlined style={{ color: loading ? '#d9d9d9' : '#52c41a' }} />
                      </p>{' '}
                      <p className="ant-upload-text">{loading ? '' : 'Kéo thả hoặc nhấp để tải lên file Excel'}</p>
                      <p className="ant-upload-hint">
                        Chỉ chấp nhận 1 file Excel (.xlsx, .xls). Dung lượng tối đa 10MB.
                      </p>
                      {loading && (
                        <div style={{ marginTop: '16px' }}>
                          <Spin size="small" />
                          <span style={{ marginLeft: '8px', color: '#8c8c8c' }}>Đang xử lý...</span>
                        </div>
                      )}
                    </StyledUpload>
                  </Form.Item>
                </Col>
              </Row>
            </StyledCard>{' '}
            <ActionButtonContainer>
              <Button onClick={onClose} size="large">
                Hủy
              </Button>{' '}
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                size="large"
                icon={<UploadOutlined />}
              >
                Import Excel
              </Button>
            </ActionButtonContainer>
          </Form>
        </FormContainer>
      </>
    </StyledDrawer>
  );
}
