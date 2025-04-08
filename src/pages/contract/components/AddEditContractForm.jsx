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

export default function AddEditContractForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contract.loading);

  const selectedContract = useSelector(
    (state) => state.contract.editingContract
  );
  console.log("editingContract2:", selectedContract);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedContract || initialState);
  }, [selectedContract]);

  const onFinish = async (values) => {
    // validate some require user password

    try {
      if (!selectedContract) {
        // dispatch(createContract(values));

        notification.success({
          message: "Success",
          description: "Add contract successfully",
        });
      } else {
        // dispatch(updateContract({ ...values, id: selectedContract }));

        notification.success({
          message: "Success",
          description: "Update contract successfully",
        });
      }
      // call api xong thì đóng Drawer

      onClose();

      navigate("/dashboard/administration/contract");
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
        isEmpty(selectedContract)
          ? "Thêm mới hợp đồng"
          : `Sửa hợp đồng ${initialValues && initialValues?.contractCode}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContract) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-contract"
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
                label="Mã hợp đồng"
                name="contractCode"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã hợp đồng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Tên hợp đồng"
                name="contractName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên hợp đồng!",
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
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tên dự án!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn dự án">
                  {["Dự án A", "Dự án B", "Dự án C", "Dự án D", "Dự án E"].map(
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
                name="construction"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tên công trình!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn công trình"
                >
                  {["Công trình 1", "Công trình 2", "Công trình 3", "Công trình 4", "Công trình 5"].map(
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
                label="Bên A"
                name="partyA"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Bên A!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn Bên A">
                  {["Công ty A", "Công ty B", "Công ty C", "Công ty D", "Công ty E"].map(
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
                label="Bên B"
                name="partyB"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Bên B!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn Bên B"
                >
                  {["Đối tác X", "Đối tác Y", "Đối tác Z", "Đối tác K", "Đối tác L"].map(
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
              {" "}
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả hợp đồng!",
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
                label="Hình ảnh hợp đồng"
                name="contractImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: "Vui lòng upload hình ảnh hợp đồng",
                  },
                ]}
              >
                <Upload.Dragger
                  name="contractImages"
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
                label="Tài liệu hợp đồng"
                name="contractDocuments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: "Vui lòng upload tài liệu hợp đồng",
                  },
                ]}
              >
                <Upload.Dragger
                  name="contractDocuments"
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
              {isEmpty(selectedContract) ? "Thêm hợp đồng" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
