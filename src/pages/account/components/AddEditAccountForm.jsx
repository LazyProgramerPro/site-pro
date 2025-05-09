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
  Divider,
  Tooltip,
  Space,
  Card,
  Typography,
  Avatar,
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  BankOutlined,
  IdcardOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const initialState = {};

export default function AddEditAccountForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.account.loading);
  const selectedAccount = useSelector((state) => state.account.editingAccount);

  useEffect(() => {
    setInitialValues(selectedAccount || initialState);
    if (open) {
      form.resetFields();
    }
  }, [selectedAccount, open, form]);

  const onFinish = async (values) => {


    
    console.log("values:", values);


    try {
      if (!selectedAccount) {
        notification.success({
          message: "Thành công",
          description: "Thêm tài khoản thành công",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
      } else {
        notification.success({
          message: "Thành công",
          description: "Cập nhật tài khoản thành công",
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
      }
      onClose();
      navigate("/dashboard/administration/account");
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: "Lỗi",
      description: errorInfo.message,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    });
  };

  const formTitle = isEmpty(selectedAccount)
    ? "Thêm mới tài khoản"
    : `Sửa tài khoản ${initialValues?.username || ""}`;

  // Function to get already selected companies
  const getSelectedCompanies = (fields, form, currentIndex) => {
    const allPositions = form.getFieldValue('positions') || [];
    return allPositions
      .map((position, index) => index !== currentIndex && position?.companyId ? position.companyId : null)
      .filter(Boolean);
  };

  // Handle select change to update form values
  const handleCompanyChange = (value, name) => {
    // Force re-render of options in all selects by updating a dummy field
    form.setFieldsValue({ _forceUpdate: Date.now() });
  };

  return (
    <Drawer
      width={window.innerWidth > 768 ? 720 : '100%'}
      title={
        <Space align="center">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ backgroundColor: isEmpty(selectedAccount) ? '#1890ff' : '#52c41a' }} 
          />
          <span>{formTitle}</span>
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
            {isEmpty(selectedAccount) ? "Tạo tài khoản" : "Cập nhật"}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {!isEmpty(selectedAccount) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin tài khoản..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-account"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Card
            title="Thông tin tài khoản"
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                  tooltip="Tên đăng nhập phải là duy nhất"
                >
                  <Input
                    autoFocus
                    disabled={!isEmpty(selectedAccount)}
                    placeholder="Nhập tên đăng nhập"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Họ và tên"
                  name="full_name"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập email" prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone_number"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Số điện thoại chỉ chứa ký tự số!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            {isEmpty(selectedAccount) && (
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: isEmpty(selectedAccount), message: "Vui lòng nhập mật khẩu!" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: isEmpty(selectedAccount),
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
                    <Input.Password
                      placeholder="Nhập lại mật khẩu"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Card>

          <Card
            title="Vai trò & Doanh nghiệp"
            bordered={false}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              label="Vai trò"
              name="group_id_list"
              rules={[
                { required: true, message: "Vui lòng chọn vai trò!" },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                allowClear
                placeholder="Chọn vai trò"
                optionFilterProp="children"
              >
                {["ADMIN", "CHỦ ĐẦU TƯ", "NHÀ THẦU THI CÔNG", "TVGS", "TVTK"].map(
                  (role, idx) => (
                    <Select.Option value={role} key={idx}>
                      {role}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>

            <Form.List 
              name="doanh_nghiep_list"
              initialValue={[{}]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    // Get already selected companies excluding current field
                    const selectedCompanies = getSelectedCompanies(fields, form, name);
                    
                    return (
                      <Row gutter={16} key={key} style={{ marginBottom: 16, alignItems: 'flex-start' }}>
                        <Col xs={24} sm={11}>
                          <Form.Item
                            {...restField}
                            name={[name, "doanh_nghiep_id"]}
                            rules={[
                              { required: true, message: "Vui lòng chọn doanh nghiệp!" },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              showSearch
                              allowClear
                              placeholder="Chọn doanh nghiệp"
                              optionFilterProp="children"
                              onChange={(value) => handleCompanyChange(value, name)}
                            >
                              {["companyId1", "companyId2", "companyId3"].map(
                                (company, idx) => (
                                  <Select.Option 
                                    value={company} 
                                    key={idx}
                                    disabled={selectedCompanies.includes(company)}
                                  >
                                    {company}
                                    {selectedCompanies.includes(company) && " (Đã chọn)"}
                                  </Select.Option>
                                )
                              )}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={11}>
                          <Form.Item
                            {...restField}
                            name={[name, "position"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập chức vụ!" },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Nhập chức vụ" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={2} style={{ display: 'flex', height: '32px' }}>
                          {fields.length > 1 && (
                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                            />
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                    >
                      Thêm vị trí
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      )}
      {loading && (
        <div style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0, 
          right: 0,
          padding: '10px 24px', 
          background: 'rgba(255, 255, 255, 0.8)', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTop: '1px solid #f0f0f0',
          backdropFilter: 'blur(4px)',
        }}>
          <Spin tip="Đang xử lý..." />
        </div>
      )}
    </Drawer>
  );
}
