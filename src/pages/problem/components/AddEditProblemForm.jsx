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

};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function AddEditProblemForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.problem.loading);

  const selectedProblem = useSelector((state) => state.problem.editingProblem);
  console.log("editingProblem:", selectedProblem);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedProblem || initialState);
  }, [selectedProblem]);

  const onFinish = async (values) => {
    try {
      if (!selectedProblem) {
        // dispatch(createProblem(values));

        notification.success({
          message: "Success",
          description: "Add problem successfully",
        });
      } else {
        // dispatch(updateProblem({ ...values, id: selectedProblem }));

        notification.success({
          message: "Success",
          description: "Update problem successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/problem");
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
        isEmpty(selectedProblem)
          ? "Thêm mới vấn đề"
          : `Sửa vấn đề ${initialValues && initialValues?.code}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedProblem) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-problem"
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
                label="Dự án"
                name="project"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn dự án!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn dự án">
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
                label="Phụ lục hợp đồng"
                name="contractAppendix"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phụ lục hợp đồng!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn phụ lục hợp đồng"
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
                label="Mã vấn đề"
                name="problemCode"
                rules={[{ required: true, message: "Vui lòng nhập mã vấn đề!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên vấn đề"
                name="problemName"
                rules={[{ required: true, message: "Vui lòng nhập tên vấn đề!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mô tả vấn đề"
                name="problemDescription"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả vấn đề!",
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tổng hợp"
                name="summary"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tổng hợp!",
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Địa điểm"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa điểm!",
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỉnh"
                name="province"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tỉnh!",
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Người được chỉ định"
                name="assignedPerson"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn người được chỉ định!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn người được chỉ định">
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
              {isEmpty(selectedProblem) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
