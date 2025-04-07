import {
  Button,
  Col,
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

export default function AddEditConstructionDiaryForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.constructionDiary.loading);

  const selectedConstructionDiary = useSelector(
    (state) => state.constructionDiary.editingConstructionDiary
  );
  console.log("editingConstructionDiary:", selectedConstructionDiary);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedConstructionDiary || initialState);
  }, [selectedConstructionDiary]);

  const onFinish = async (values) => {
    try {
      if (!selectedConstructionDiary) {
        // dispatch(createConstructionDiary(values));

        notification.success({
          message: "Success",
          description: "Add construction diary successfully",
        });
      } else {
        // dispatch(updateConstructionDiary({ ...values, id: selectedConstructionDiary }));

        notification.success({
          message: "Success",
          description: "Update construction diary successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/construction-diary");
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
        isEmpty(selectedConstructionDiary)
          ? "Thêm mới nhật ký thi công"
          : `Sửa nhật ký thi công ${initialValues && initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedConstructionDiary) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-construction-diary"
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
                label="Mã nhật ký"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên đăng nhập!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Tên nhật ký"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập họ và tên!",
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
                label="Tên dự án"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Please input your role!",
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
                label="Tên công trình"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Please input your company!",
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
                label="Loại nhật ký"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please input your position!",
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

            <Col span={12}>
              <Form.Item
                label="Thời tiết"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please input your position!",
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Công tác vệ sinh môi trường"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please input your position!",
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

            <Col span={12}>
              <Form.Item
                label="Công tác an toàn lao động"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please input your position!",
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

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tình hình sử dụng phương tiện bảo hộ các nhân"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Please input your position!",
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          {/* Trường upload ảnh */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Hình ảnh vấn đề"
                name="problemImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: "Vui lòng upload hình ảnh vấn đề",
                  },
                ]}
              >
                <Upload.Dragger
                  name="problemImages"
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
                label="Tài liệu vấn đề"
                name="problemDocuments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: "Vui lòng upload tài liệu vấn đề",
                  },
                ]}
              >
                <Upload.Dragger
                  name="problemDocuments"
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
              {isEmpty(selectedConstructionDiary) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
