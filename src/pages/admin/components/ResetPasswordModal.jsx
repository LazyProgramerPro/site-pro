import { logOut } from '@/pages/auth/redux/user.slice';
import { useAppDispatch } from '@/redux/store';
import http from '@/utils/http';
import { CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Typography } from 'antd';
import { useState } from 'react';

import styled from 'styled-components';

const { Text, Paragraph } = Typography;

const TriggerContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

const PasswordRequirements = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const ResetPasswordModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useAppDispatch();

  // Password validation regex patterns
  const passwordValidationPatterns = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    minLength: 8,
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập mật khẩu mới'));
    }

    if (value.length < passwordValidationPatterns.minLength) {
      return Promise.reject(new Error(`Mật khẩu phải có ít nhất ${passwordValidationPatterns.minLength} ký tự`));
    }

    if (!passwordValidationPatterns.uppercase.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ in hoa'));
    }

    if (!passwordValidationPatterns.lowercase.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ thường'));
    }

    if (!passwordValidationPatterns.number.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 chữ số'));
    }

    if (!passwordValidationPatterns.special.test(value)) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'));
    }

    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng xác nhận mật khẩu mới'));
    }

    const newPassword = form.getFieldValue('new_password');
    if (value !== newPassword) {
      return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
    }

    return Promise.resolve();
  };

  // Hàm xử lý submit form đổi mật khẩu sử dụng http file (axios instance)

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API đổi mật khẩu
      await http.post('/auth/user/update-password', {
        old_password: values.old_password,
        new_password: values.new_password,
      });

      setSuccess(true);

      dispatch(logOut());
      localStorage.removeItem('user');
      message.success('Đổi mật khẩu thành công');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        message.error('Mật khẩu hiện tại không chính xác');
      } else {
        message.error('Đổi mật khẩu thất bại. Vui lòng thử lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const showModal = () => {
    form.resetFields();
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    if (!loading) {
      setIsModalOpen(false);

      // Reset form after modal is closed
      setTimeout(() => {
        form.resetFields();
        setSuccess(false);
      }, 300);
    }
  };

  return (
    <>
      <TriggerContainer onClick={showModal}>
        <LockOutlined />
        <div>Đổi mật khẩu</div>
      </TriggerContainer>

      <Modal
        title="Thay đổi mật khẩu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        maskClosable={!loading}
        closable={!loading}
        width={500}
      >
        {success ? (
          <SuccessMessage>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
            <Text strong>Thay đổi mật khẩu thành công!</Text>
          </SuccessMessage>
        ) : (
          <Form
            form={form}
            name="reset-password-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <PasswordRequirements>
              <Paragraph strong style={{ marginBottom: 8 }}>
                Yêu cầu mật khẩu:
              </Paragraph>
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li>Ít nhất {passwordValidationPatterns.minLength} ký tự</li>
                <li>Ít nhất 1 chữ in hoa</li>
                <li>Ít nhất 1 chữ thường</li>
                <li>Ít nhất 1 chữ số</li>
                <li>Ít nhất 1 ký tự đặc biệt ( !@#$%^&*(),.?":{}|&lt;&gt;)</li>
              </ul>
            </PasswordRequirements>

            <Form.Item
              label="Mật khẩu hiện tại"
              name="old_password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu hiện tại" />
            </Form.Item>

            <Form.Item label="Mật khẩu mới" name="new_password" rules={[{ validator: validatePassword }]} hasFeedback>
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirm_password"
              dependencies={['new_password']}
              rules={[{ validator: validateConfirmPassword }]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} disabled={loading}>
                  Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
