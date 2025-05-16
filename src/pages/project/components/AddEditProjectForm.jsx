import { useAppDispatch } from '@/redux/store';
import { CloseCircleOutlined, InboxOutlined, ProjectOutlined, SaveOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBusinessList } from '../../business/redux/business.slice';
import { addProject, getProjectList, updateProject } from '../redux/project.slice';

const initialState = {};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function AddEditProjectForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const [companies, setCompanies] = useState([]);
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
        console.error('Failed to fetch companies:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách công ty',
        });
      }
    };

    fetchCompanies();
  }, [dispatch]);

  const selectedProject = useSelector((state) => state.project.editingProject);
  console.log('editingProject:', selectedProject);
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
    } else {
      setInitialValues(initialState);
    }
  }, [selectedProject]);

  console.log('selectedProject1111:', selectedProject);
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
      console.log('error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi xử lý yêu cầu',
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
      {' '}
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
            </Col>
          </Row>{' '}
          {/* Trường upload ảnh */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Hình ảnh dự án"
                name="projectImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: 'Vui lòng upload hình ảnh dự án',
                  },
                ]}
              >
                <Upload.Dragger
                  name="projectImages"
                  listType="picture-card"
                  multiple
                  beforeUpload={() => false} // Ngăn upload tự động
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Kéo thả hoặc nhấp để tải lên hình ảnh</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chỉ chấp nhận file ảnh (JPG, PNG, GIF...)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
          {/* Trường upload file */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tài liệu dự án"
                name="projectDocuments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: 'Vui lòng upload tài liệu dự án',
                  },
                ]}
              >
                <Upload.Dragger
                  name="projectDocuments"
                  multiple
                  beforeUpload={() => false} // Ngăn upload tự động
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Kéo thả hoặc nhấp để tải lên tài liệu</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chấp nhận các định dạng: PDF, DOC, DOCX, XLS, XLSX, TXT
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
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
