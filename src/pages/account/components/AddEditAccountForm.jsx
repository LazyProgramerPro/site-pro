import { getBusinessList } from '@/pages/business/redux/business.slice';
import { useAppDispatch } from '@/redux/store';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  notification,
} from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addAccount, getAccountList, updateAccount } from '../redux/account.slice';
import { getGroupList } from '../redux/group.slice';

const { Title } = Typography;
const initialState = {};

export default function AddEditAccountForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const dispatch = useAppDispatch();
  const loading = useSelector((state) => state.account.loading);
  const selectedAccount = useSelector((state) => state.account.editingAccount);
  const groupList = useSelector((state) => state.group.groupList);
  const businessList = useSelector((state) => state.business.businessList);

  console.log('groupList:', groupList, businessList);

  useEffect(() => {
    const promiseForGetGroup = dispatch(getGroupList());
    const promiseForGetBusiness = dispatch(getBusinessList());
    return () => {
      promiseForGetGroup.abort();
      promiseForGetBusiness.abort();
    };
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      let formData = { ...selectedAccount };

      if (selectedAccount.group_id_list && Array.isArray(selectedAccount.group_id_list)) {
      } else if (selectedAccount.role && Array.isArray(selectedAccount.role)) {
        formData.group_id_list = selectedAccount.role.map((role) => role.id);
      } else {
        formData.group_id_list = [];
      }

      if (formData.doanh_nghiep_list && Array.isArray(formData.doanh_nghiep_list)) {
      } else if (selectedAccount.company && Array.isArray(selectedAccount.company)) {
        formData.doanh_nghiep_list = selectedAccount.company.map((company) => ({
          doanh_nghiep_id: company.id || company.doanh_nghiep_id || null,
          position: company.position || company.chucVu || '',
        }));
      } else {
        formData.doanh_nghiep_list = [{}];
      }

      // dispatch(getGroupList());
      // dispatch(getBusinessList());
      setInitialValues(formData);
    } else {
      setInitialValues(initialState);
    }

    if (open) {
      form.resetFields();
    }
  }, [selectedAccount, open, form]);

  // After form is reset, set values for edit mode
  useEffect(() => {
    if (open && !isEmpty(initialValues)) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, open, form]);
  const onFinish = async (values) => {
    console.log('values:', values);

    try {
      if (!selectedAccount) {
        // Gọi API tạo tài khoản mới và xử lý lỗi nếu có
        try {
          await dispatch(addAccount(values)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm tài khoản thành công',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          });

          // Lấy lại danh sách tài khoản mới nhất
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          // Đảm bảo lấy lại dữ liệu trước khi đóng drawer
          await dispatch(getAccountList(filters));

          // Đóng drawer sau khi lấy dữ liệu thành công
          onClose();

          // Chuyển hướng sau khi đã đóng drawer
          navigate('/dashboard/administration/account');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Thêm tài khoản thất bại',
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          });
          return;
        }
      } else {
        // Call API to update existing account
        const updatePayload = {
          id: selectedAccount.id,
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number,
          doanh_nghiep_list: values.doanh_nghiep_list,
          group_id_list: values.group_id_list,
        };

        try {
          await dispatch(updateAccount(updatePayload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật tài khoản thành công',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          });

          // Refresh account list after update
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          // Đảm bảo lấy lại dữ liệu trước khi đóng drawer
          await dispatch(getAccountList(filters));

          // Đóng drawer sau khi lấy dữ liệu thành công
          onClose();

          // Chuyển hướng sau khi đã đóng drawer
          navigate('/dashboard/administration/account');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Cập nhật tài khoản thất bại',
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
          });
          return;
        }
      }
    } catch (error) {
      console.log('error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi không xác định khi xử lý yêu cầu',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Lỗi ',
      description: errorInfo.message ?? 'Đã xảy ra lỗi khi xử lý yêu cầu',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    });
  };

  const formTitle = isEmpty(selectedAccount) ? 'Thêm mới tài khoản' : `Sửa tài khoản ${initialValues?.username || ''}`;

  // Function to get already selected companies
  const getSelectedCompanies = (fields, form, currentIndex) => {
    return fields
      .map(({ name }) => form.getFieldValue(['doanh_nghiep_list', name, 'doanh_nghiep_id']))
      .filter((companyId, index) => index !== currentIndex && companyId);
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
            {isEmpty(selectedAccount) ? 'Tạo tài khoản' : 'Cập nhật'}
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
          <Card title="Thông tin tài khoản" bordered={false} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên đăng nhập"
                  name="username"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
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
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
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
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    {
                      pattern: /^[0-9]+$/,
                      message: 'Số điện thoại chỉ chứa ký tự số!',
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
                    rules={[{ required: isEmpty(selectedAccount), message: 'Vui lòng nhập mật khẩu!' }]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu" prefix={<LockOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: isEmpty(selectedAccount),
                        message: 'Vui lòng xác nhận mật khẩu!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Nhập lại mật khẩu" prefix={<LockOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Card>

          <Card title="Vai trò & Doanh nghiệp" bordered={false} style={{ marginBottom: 16 }}>
            <Form.Item
              label="Vai trò"
              name="group_id_list"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Select mode="multiple" showSearch allowClear placeholder="Chọn vai trò" optionFilterProp="children">
                {groupList?.map((role, idx) => (
                  <Select.Option value={role.id} key={idx}>
                    {role?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.List name="doanh_nghiep_list" initialValue={[]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    // Get already selected companies excluding current field
                    const selectedCompanies = getSelectedCompanies(fields, form, name);

                    console.log('selectedCompanies:', selectedCompanies);

                    return (
                      <Row gutter={16} key={key} style={{ marginBottom: 16, alignItems: 'flex-start' }}>
                        <Col xs={24} sm={11}>
                          <Form.Item
                            {...restField}
                            name={[name, 'doanh_nghiep_id']}
                            rules={[{ required: true, message: 'Vui lòng chọn doanh nghiệp!' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Select
                              showSearch
                              allowClear
                              placeholder="Chọn doanh nghiệp"
                              optionFilterProp="children"
                              onChange={(value) => handleCompanyChange(value, name)}
                            >
                              {businessList.map((company, idx) => (
                                <Select.Option
                                  value={company?.id}
                                  key={idx}
                                  disabled={selectedCompanies.includes(company?.id)}
                                >
                                  {company?.name}
                                  {selectedCompanies.includes(company?.id) && ' (Đã chọn)'}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>{' '}
                        <Col xs={24} sm={11}>
                          <Form.Item
                            {...restField}
                            name={[name, 'position']}
                            rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Nhập chức vụ" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={2} style={{ display: 'flex', height: '32px' }}>
                          <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    );
                  })}
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm doanh nghiệp và vị trí trong doanh nghiệp
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      )}{' '}
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
