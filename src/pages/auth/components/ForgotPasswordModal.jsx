import http from '@/utils/http';
import { ArrowLeftOutlined, CheckCircleOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Modal, Result, Typography } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const { Text, Paragraph, Title } = Typography;

const ModalContainer = styled.div`
  position: relative;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-weight: 500;
    color: #434343;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 24px 0 16px;
`;

const DescriptionText = styled(Paragraph)`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
`;

const FormWrapper = styled.div`
  padding: 0 8px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: nhập thông tin, 2: xác nhận thành công

  // Gửi yêu cầu khôi phục mật khẩu
  const handleRequestReset = async (values) => {
    setLoading(true);
    try {
      await http.post('/auth/user/reset-password', {
        username: values.username,
        email: values.email,
      });
      setEmail(values.email);
      setSuccess(true);
      setStep(2);
      message.success('Yêu cầu đã được gửi thành công!');
      form.resetFields();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error('Không tìm thấy tài khoản với thông tin đã cung cấp');
      } else {
        message.error('Không thể gửi yêu cầu. Vui lòng thử lại sau!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
      setTimeout(() => {
        form.resetFields();
        setSuccess(false);
        setEmail('');
        setStep(1);
      }, 300);
    }
  };

  const handleBack = () => {
    if (!loading) {
      setStep(1);
      setSuccess(false);
    }
  };
  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>Khôi phục mật khẩu</div>}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      maskClosable={!loading}
      closable={!loading}
      width={480}
      centered
    >
      <ModalContainer>
        {step === 1 ? (
          <FormWrapper>
            <DescriptionText>Vui lòng cung cấp thông tin tài khoản của bạn để khôi phục mật khẩu.</DescriptionText>
            <Divider style={{ margin: '0 0 24px' }} />

            <StyledForm
              form={form}
              name="forgot-password-request-form"
              onFinish={handleRequestReset}
              autoComplete="off"
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                label="Tên tài khoản"
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tài khoản' },
                  { whitespace: true, message: 'Tên tài khoản không được chứa khoảng trắng!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                  placeholder="Nhập tên tài khoản"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                  placeholder="Nhập email đã đăng ký"
                />
              </Form.Item>

              <ButtonsContainer>
                <Button onClick={handleCancel} disabled={loading}>
                  Hủy bỏ
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Gửi yêu cầu
                </Button>
              </ButtonsContainer>
            </StyledForm>
          </FormWrapper>
        ) : (
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            status="success"
            title="Yêu cầu đã được gửi thành công!"
            subTitle={
              <div>
                Vui lòng kiểm tra email{' '}
                <Text strong style={{ wordBreak: 'break-all' }}>
                  {email}
                </Text>{' '}
                để nhận hướng dẫn đặt lại mật khẩu.
              </div>
            }
            extra={[
              <Button key="back" onClick={handleBack} icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>,
              <Button type="primary" key="close" onClick={handleCancel}>
                Đóng
              </Button>,
            ]}
          />
        )}
      </ModalContainer>
    </Modal>
  );
};

export default ForgotPasswordModal;
