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

export default function AddEditContractAddendumForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contractAddendum.loading);

  const selectedContractAddendum = useSelector(
    (state) => state.contractAddendum.editingContractAddendum
  );
  console.log("editingContractAddendum:", selectedContractAddendum);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedContractAddendum || initialState);
  }, [selectedContractAddendum]);

  const onFinish = async (values) => {
    try {
      if (!selectedContractAddendum) {
        // dispatch(createContractAddendum(values));

        notification.success({
          message: "Success",
          description: "Add contract addendum successfully",
        });
      } else {
        // dispatch(updateContractAddendum({ ...values, id: selectedContractAddendum }));

        notification.success({
          message: "Success",
          description: "Update contract addendum successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/contract-addendum");
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
        isEmpty(selectedContractAddendum)
          ? "Thêm mới phụ lục hợp đồng"
          : `Sửa phụ lục hợp đồng ${initialValues && initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContractAddendum) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-contract-addendum"
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
                label="Mã phụ lục hợp đồng"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã phụ lục hợp đồng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                label="Tên phụ lục hợp đồng"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên phụ lục hợp đồng!",
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
                label="Tên công trình"
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
                label="Tên hợp đồng"
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
                label="Hạng mục"
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
                label="Nhóm"
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
                label="Đơn vị"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tư vấn giám sát!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Khối lượng"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã phụ lục hợp đồng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Đơn giá"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã phụ lục hợp đồng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Thành tiền"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã phụ lục hợp đồng!",
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

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedContractAddendum) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
