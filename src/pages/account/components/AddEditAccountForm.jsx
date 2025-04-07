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
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialState = {};

export default function AddEditAccountForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.account.loading);

  const selectedAccount = useSelector((state) => state.account.editingAccount);
  console.log("editingAccount2:", selectedAccount);

  useEffect(() => {
    setInitialValues(selectedAccount || initialState);
  }, [selectedAccount]);

  const onFinish = async (values) => {
    // validate some require user password

    try {
      if (!selectedAccount) {
        // dispatch(createAccount(values));

        notification.success({
          message: "Success",
          description: "Add category successfully",
        });
      } else {
        // dispatch(updateAccount({ ...values, id: selectedAccount }));

        notification.success({
          message: "Success",
          description: "Update category successfully",
        });
      }
      // call api xong thì đóng Drawer

      onClose();

      navigate("/dashboard/administration/account");
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
        isEmpty(selectedAccount)
          ? "Thêm mới tài khoản"
          : `Sửa tài khoản ${initialValues && initialValues?.username}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedAccount) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-account"
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
                label="Tên đăng nhập"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên đăng nhập!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên!",
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
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Mật khẩu xác nhận không khớp!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Số điện thoại chỉ chứa ký tự số!",
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
                label="Vai trò"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn vai trò!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn vai trò">
                  {["Quản trị viên", "Nhân viên", "Khách hàng"].map(
                    (role, index) => (
                      <Select.Option value={role} key={index}>
                        {role}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Doanh nghiệp"
                name="company"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn doanh nghiệp!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn doanh nghiệp">
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
                    (company, index) => (
                      <Select.Option value={company} key={index}>
                        {company}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chức vụ!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn chức vụ">
                  {["Giám đốc", "Trưởng phòng", "Nhân viên"].map(
                    (position, index) => (
                      <Select.Option value={position} key={index}>
                        {position}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedAccount) ? "Tạo tài khoản" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
