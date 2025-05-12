import { useAppDispatch } from '@/redux/store';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Form, Input, notification, Row, Select, Spin } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserList } from '../redux/business-user.slice';
import { addBusiness, getBusinessList, updateBusiness } from '../redux/business.slice';

const initialState = {};

export default function AddEditBusinessForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const dispatch = useAppDispatch();

  const loading = useSelector((state) => state.business.loading);
  const userLoading = useSelector((state) => state.businessUser.loading);
  const userList = useSelector((state) => state.businessUser.userList);

  const selectedBusiness = useSelector((state) => state.business.editingBusiness);
  useEffect(() => {
    if (selectedBusiness) {
      // Transform the API response properties to match form field names
      const formData = {
        code: selectedBusiness.code,
        name: selectedBusiness.name,
        leader_id: selectedBusiness.leader_id || [],
      };
      setInitialValues(formData);

      // Load user list for leader selection when editing
      const filters = {
        pageNo: 0,
        pageSize: 100,
        searchText: '',
      };
      dispatch(getUserList(filters));
    } else {
      setInitialValues(initialState);
    }

    if (open) {
      form.resetFields();
    }
  }, [selectedBusiness, open, form, dispatch]);

  // After form is reset, set values for edit mode
  useEffect(() => {
    if (open && !isEmpty(initialValues)) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, open, form]);
  const onFinish = async (values) => {
    try {
      if (!selectedBusiness) {
        // Create new business
        const payload = {
          name: values.name,
          code: values.code,
        };

        await dispatch(addBusiness(payload));

        notification.success({
          message: 'Thành công',
          description: 'Thêm doanh nghiệp thành công',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });

        // Refresh business list
        const filters = {
          pageNo: 0,
          pageSize: 10,
          searchText: '',
        };
        await dispatch(getBusinessList(filters));
      } else {
        // Update existing business
        const payload = {
          id: selectedBusiness.id,
          name: values.name,
          code: values.code,
          leader_id: values.leader_id,
        };

        await dispatch(updateBusiness(payload));

        notification.success({
          message: 'Thành công',
          description: 'Cập nhật doanh nghiệp thành công',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });

        // Refresh business list
        const filters = {
          pageNo: 0,
          pageSize: 10,
          searchText: '',
        };
        await dispatch(getBusinessList(filters));
      }

      onClose();
      navigate('/dashboard/administration/business');
    } catch (error) {
      console.log('error:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi khi xử lý yêu cầu',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    notification.error({
      message: 'Lỗi',
      description: errorInfo.message,
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    });
  };
  return (
    <Drawer
      width={500}
      title={
        isEmpty(selectedBusiness)
          ? 'Thêm mới doanh nghiệp'
          : `Sửa doanh nghiệp ${(initialValues && initialValues?.name) || initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {!isEmpty(selectedBusiness) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin doanh nghiệp..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-business"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label="Mã doanh nghiệp"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã doanh nghiệp!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label="Tên doanh nghiệp"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên doanh nghiệp!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>{' '}
          {/* Only show the leader selection field when editing */}
          {!isEmpty(selectedBusiness) && (
            <Row gutter={12}>
              <Col span={24}>
                <Form.Item
                  label="Người phụ trách"
                  name="leader_id"
                  rules={[
                    {
                      required: false,
                      message: 'Vui lòng chọn người phụ trách!',
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chọn người phụ trách"
                    loading={userLoading}
                    filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    options={userList.map((user) => ({
                      value: user.id,
                      label: user.fullname || user.username,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading} style={{ marginTop: '16px' }}>
              {isEmpty(selectedBusiness) ? 'Thêm doanh nghiệp' : 'Cập nhật doanh nghiệp'}
            </Button>
          </Form.Item>
        </Form>
      )}
      {loading && (
        <div
          style={{
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
          }}
        >
          <Spin tip="Đang xử lý..." />
        </div>
      )}
    </Drawer>
  );
}
