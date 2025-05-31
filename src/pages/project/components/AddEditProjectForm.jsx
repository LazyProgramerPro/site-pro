import { useAppDispatch } from '@/redux/store';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  InboxOutlined,
  LoadingOutlined,
  ProjectOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Image,
  Input,
  List,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  deleteProjectDocument,
  deleteProjectImage,
  getProjectDocuments,
  uploadProjectDocument,
  uploadProjectImage,
} from '../../../services/uploadService';
import { getBusinessList } from '../../business/redux/business.slice';
import { addProject, getProjectList, updateProject } from '../redux/project.slice';

const { Text } = Typography;

const initialState = {};

// Upload states and handlers
export default function AddEditProjectForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const [companies, setCompanies] = useState([]);
  // Upload-related states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const dispatch = useAppDispatch();

  const loading = useSelector((state) => state.project.loading);

  // Fetch companies for dropdowns when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const result = await dispatch(getBusinessList({ pageNo: 0, pageSize: 100 })).unwrap();
        if (result?.data) {
          setCompanies(result.data);
        }
      } catch (error) {
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách công ty',
        });
      }
    };

    fetchCompanies();
  }, [dispatch]);
  const selectedProject = useSelector((state) => state.project.editingProject);

  // Function để load danh sách tài liệu và hình ảnh từ API
  const loadProjectDocuments = async (projectId) => {
    if (!projectId) return;

    setLoadingDocuments(true);
    try {
      const { doc, childDocs } = await getProjectDocuments(projectId);

      if (childDocs && childDocs.length > 0) {
        // Phân loại tài liệu thành images và documents
        const images = [];
        const documents = [];
        childDocs.forEach((item) => {
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
      }
    } catch (error) {
      setUploadedImages([]);
      setUploadedDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };
  // Enhanced debug function để kiểm tra URL hình ảnh
  const debugImageUrl = (url, name) => {
    // Test if it's a valid URL format
    try {
      if (url) {
        const urlObj = new URL(url);
      }
    } catch (e) {
      // URL parsing failed
    }

    return url;
  };

  useEffect(() => {
    // Transform dates from string to moment objects with explicit format
    if (selectedProject) {
      const formattedProject = {
        ...selectedProject,
        start_at: selectedProject.start_at ? moment(selectedProject.start_at) : null,
        finish_at: selectedProject.finish_at ? moment(selectedProject.finish_at) : null,
        nha_thau_thi_cong_id: selectedProject.nha_thau_thi_cong_id || '',
        tu_van_giam_sat_id: selectedProject.tu_van_giam_sat_id || '',
        tu_van_thiet_ke_id: selectedProject.tu_van_thiet_ke_id || '',
      };
      setInitialValues(formattedProject);

      // Load danh sách tài liệu và hình ảnh từ API
      loadProjectDocuments(selectedProject.id);
    } else {
      setInitialValues(initialState);
      setUploadedImages([]);
      setUploadedDocuments([]);
    }
  }, [selectedProject]);

  // Component để hiển thị hình ảnh với error handling cải tiến
  const ProjectImageDisplay = ({ image, size = 'small' }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Size configurations
    const sizeConfig = {
      small: { width: 48, height: 48, fallbackFontSize: '9px' },
      large: { width: 160, height: 120, fallbackFontSize: '12px' },
    };

    const currentSize = sizeConfig[size] || sizeConfig.small;

    // Validate URL with detailed checking
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
    const handleImageError = (event) => {
      setImageError(true);
      setIsLoading(false);
    };
    const handleImageLoad = (event) => {
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
          alt={image.name || 'Project Image'}
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
    if (!selectedProject?.id) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng lưu dự án trước khi upload hình ảnh',
      });
      return false;
    }

    setUploadingImage(true);
    try {
      const parentId = null;
      const result = await uploadProjectImage(file, selectedProject.id, parentId);

      // Reload danh sách tài liệu từ API để cập nhật
      await loadProjectDocuments(selectedProject.id);

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
    if (!selectedProject?.id) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng lưu dự án trước khi upload tài liệu',
      });
      return false;
    }

    setUploadingDocument(true);
    try {
      const result = await uploadProjectDocument(file, selectedProject.id);

      // Reload danh sách tài liệu từ API để cập nhật
      await loadProjectDocuments(selectedProject.id);

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
    if (!selectedProject?.id) return;

    try {
      await deleteProjectImage(imageId, selectedProject.id);

      // Reload danh sách tài liệu từ API để cập nhật
      await loadProjectDocuments(selectedProject.id);

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
    if (!selectedProject?.id) return;

    try {
      await deleteProjectDocument(documentId, selectedProject.id);

      // Reload danh sách tài liệu từ API để cập nhật
      await loadProjectDocuments(selectedProject.id);

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

  const onFinish = async (values) => {
    try {
      if (!selectedProject) {
        // Format dates for API
        const payload = {
          code: values.code,
          name: values.name,
          description: values.description,
          start_at: values.start_at ? values.start_at.toISOString() : null,
          finish_at: values.finish_at ? values.finish_at.toISOString() : null,
          nha_thau_thi_cong_id: values.nha_thau_thi_cong_id,
          tu_van_giam_sat_id: values.tu_van_giam_sat_id,
          tu_van_thiet_ke_id: values.tu_van_thiet_ke_id,
        };
        try {
          await dispatch(addProject(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm dự án thành công',
          });

          // get new project list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };

          await dispatch(getProjectList(filters));

          onClose();

          navigate('/dashboard/project');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm dự án',
          });
          return;
        }
      } else {
        // Format dates for API
        const payload = {
          id: selectedProject.id,
          code: values.code,
          name: values.name,
          description: values.description,
          start_at: values.start_at ? values.start_at.toISOString() : null,
          finish_at: values.finish_at ? values.finish_at.toISOString() : null,
          nha_thau_thi_cong_id: values.nha_thau_thi_cong_id,
          tu_van_giam_sat_id: values.tu_van_giam_sat_id,
          tu_van_thiet_ke_id: values.tu_van_thiet_ke_id,
        };
        try {
          await dispatch(updateProject(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật dự án thành công',
          });

          // get new project list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };

          await dispatch(getProjectList(filters));

          onClose();

          navigate('/dashboard/project');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật dự án',
          });
        }
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi xử lý yêu cầu',
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Lỗi',
      description: errorInfo.message ?? 'Đã xảy ra lỗi khi xử lý yêu cầu',
    });
  };
  return (
    <Drawer
      width={window.innerWidth > 768 ? 720 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<ProjectOutlined />}
            style={{ backgroundColor: isEmpty(selectedProject) ? '#1890ff' : '#52c41a' }}
          />
          <span>{isEmpty(selectedProject) ? 'Thêm mới dự án' : `Sửa dự án ${initialValues?.code || ''}`}</span>
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
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            disabled={loading}
            icon={<SaveOutlined />}
          >
            {isEmpty(selectedProject) ? 'Tạo dự án' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
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
      </style>{' '}
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin dự án..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-project"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã dự án"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã dự án!',
                  },
                ]}
                tooltip="Mã dự án phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã dự án" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên dự án"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên dự án!',
                  },
                ]}
              >
                <Input placeholder="Nhập tên dự án" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả dự án!' }]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả chi tiết về dự án" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="start_at"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày bắt đầu!',
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Ngày kết thúc"
                name="finish_at"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ngày kết thúc!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('start_at')) {
                        return Promise.resolve();
                      }
                      // Use moment to compare dates properly
                      const startDate = getFieldValue('start_at');
                      if (value.isAfter(startDate, 'day') || value.isSame(startDate, 'day')) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!'));
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nhà thầu thi công"
                name="nha_thau_thi_cong_id"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn nhà thầu thi công!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn nhà thầu thi công"
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.id,
                  }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tư vấn giám sát"
                name="tu_van_giam_sat_id"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tư vấn giám sát!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn tư vấn giám sát"
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.id,
                  }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tư vấn thiết kế"
                name="tu_van_thiet_ke_id"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tư vấn thiết kế!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn tư vấn thiết kế"
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.id,
                  }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Col>{' '}
          </Row>{' '}
          {/* Chỉ hiển thị form upload khi đang ở chế độ edit */}
          {selectedProject && (
            <>
              {/* Upload hình ảnh dự án */}
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <span>Hình ảnh dự án</span>
                        {uploadingImage && <LoadingOutlined />}
                      </Space>
                    }
                  >
                    <Upload.Dragger
                      beforeUpload={handleImageUpload}
                      // accept="image/*"
                      showUploadList={false}
                      disabled={uploadingImage}
                      style={{ marginBottom: 16 }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {uploadingImage ? 'Đang upload...' : 'Kéo thả hoặc nhấp để tải lên hình ảnh'}
                      </p>
                      <p className="ant-upload-hint">
                        Chỉ cho phép upload 1 file mỗi lần. Chấp nhận file ảnh (JPG, PNG, GIF...)
                      </p>
                    </Upload.Dragger>{' '}
                    {/* Hiển thị danh sách hình ảnh đã upload */}
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
                                extra={<ProjectImageDisplay image={image} size="small" />}
                              >
                                <List.Item.Meta
                                  title={image.name || 'Không có tên'}
                                  description={`Hình ảnh dự án • ID: ${image.id}`}
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      )
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* Upload tài liệu dự án */}
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <span>Tài liệu dự án</span>
                        {uploadingDocument && <LoadingOutlined />}
                      </Space>
                    }
                  >
                    <Upload.Dragger
                      beforeUpload={handleDocumentUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                      showUploadList={false}
                      disabled={uploadingDocument}
                      style={{ marginBottom: 16 }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {uploadingDocument ? 'Đang upload...' : 'Kéo thả hoặc nhấp để tải lên tài liệu'}
                      </p>
                      <p className="ant-upload-hint">
                        Chỉ cho phép upload 1 file mỗi lần. Chấp nhận các định dạng: PDF, DOC, DOCX, XLS, XLSX, TXT
                      </p>
                    </Upload.Dragger>{' '}
                    {/* Hiển thị danh sách tài liệu đã upload */}
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
                                  description={`Tài liệu dự án • ${document.size || 'N/A'}`}
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      )
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      )}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Spin size="large" tip="Đang xử lý..." />
        </div>
      )}
    </Drawer>
  );
}
