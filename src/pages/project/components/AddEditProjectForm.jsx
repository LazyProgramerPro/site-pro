import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, notification, Row, Select, Spin, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

  const loading = useSelector((state) => state.project.loading);

  const selectedProject = useSelector((state) => state.project.editingProject);
  console.log('editingProject:', selectedProject);

  useEffect(() => {
    // Transform dates from string to moment objects with explicit format
    if (selectedProject) {
      const formattedProject = {
        ...selectedProject,
        startDate: selectedProject.startDate ? moment(selectedProject.startDate, "DD/MM/YYYY") : null,
        endDate: selectedProject.endDate ? moment(selectedProject.endDate, "DD/MM/YYYY") : null,
      };
      setInitialValues(formattedProject);
    } else {
      setInitialValues(initialState);
    }
  }, [selectedProject]);


  console.log("selectedProject1111:", selectedProject);

  const onFinish = async (values) => {
    try {
      if (!selectedProject) {
        // dispatch(createProject(values));

        notification.success({
          message: 'Success',
          description: 'Add project successfully',
        });
      } else {
        // dispatch(updateProject({ ...values, id: selectedProject }));

        notification.success({
          message: 'Success',
          description: 'Update project successfully',
        });
      }

      onClose();

      navigate('/dashboard/administration/project');
    } catch (error) {
      console.log('error:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    notification.error({
      message: 'Errors',
      description: errorInfo.message,
    });
  };
  return (
    <Drawer
      width={720}
      title={isEmpty(selectedProject) ? 'Thêm mới dự án' : `Sửa dự án ${initialValues && initialValues?.projectCode}`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-project"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã dự án"
                name="projectCode"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập mã dự án!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Tên dự án"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tên dự án!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Đia chỉ" name="address" rules={[{ required: true, message: 'Bạn phải nhập địa chỉ' }]}>
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Bạn phải nhập mô tả!' }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập ngày bắt đầu!',
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập ngày kết thúc!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('startDate')) {
                        return Promise.resolve();
                      }
                      if (value.isSameOrAfter(getFieldValue('startDate'))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nhà thầu thi công"
                name="contractor"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập nhà thầu thi công!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn nhà thầu thi công">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tư vấn giám sát"
                name="supervisor"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tư vấn giám sát!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn tư vấn giám sát">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tư vấn thiết kế"
                name="designer"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tư vấn thiết kế!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn tư vấn thiết kế">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedProject) ? 'Thêm dự án' : 'Cập nhật'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
