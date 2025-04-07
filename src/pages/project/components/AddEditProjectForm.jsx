import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Spin,
  notification,
  Upload,
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const initialState = {
  userName: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  email: "",
  phoneNumber: "",
  role: "",
  company: "",
  position: "",
};

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
  console.log("editingProject:", selectedProject);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedProject || initialState);
  }, [selectedProject]);

  const onFinish = async (values) => {
    try {
      if (!selectedProject) {
        // dispatch(createProject(values));

        notification.success({
          message: "Success",
          description: "Add project successfully",
        });
      } else {
        // dispatch(updateProject({ ...values, id: selectedProject }));

        notification.success({
          message: "Success",
          description: "Update project successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/project");
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Errors",
      description: errorInfo.message,
    });
  };
  return (
    <Drawer
      width={720}
      title={
        isEmpty(selectedProject)
          ? "Thêm mới dự án"
          : `Sửa dự án ${initialValues && initialValues?.name}`
      }
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
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã dự án!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Tên dự án"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên dự án!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Đia chỉ"
                name="password"
                rules={[{ required: true, message: "Bạn phải nhập địa chỉ" }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mô tả"
                name="confirmPassword"
                rules={[{ required: true, message: "Bạn phải nhập mô tả!" }]}
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
                    message: "Bạn phải nhập ngày bắt đầu!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập ngày kết thúc!",
                  },
                ]}
                dependencies={["startDate"]}
                hasFeedback
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nhà thầu thi công"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập nhà thầu thi công!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Select an item role">
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tư vấn giám sát"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tư vấn giám sát!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select an item company"
                >
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tư vấn thiết kế"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tư vấn thiết kế!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select an item position"
                >
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
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
                    message: "Vui lòng upload hình ảnh dự án",
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
                  <p className="ant-upload-text">
                    Kéo thả hoặc nhấp để tải lên hình ảnh
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chỉ chấp nhận file ảnh
                    (JPG, PNG, GIF...)
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
                    message: "Vui lòng upload tài liệu dự án",
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
                  <p className="ant-upload-text">
                    Kéo thả hoặc nhấp để tải lên tài liệu
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chấp nhận các định dạng:
                    PDF, DOC, DOCX, XLS, XLSX, TXT
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedProject) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
