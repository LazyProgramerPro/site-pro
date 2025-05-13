import { useAppDispatch } from '@/redux/store';
import http from '@/utils/http';
import { Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Wrapper from '../../../assets/wrappers/Login';
import { loggedInUser } from '../redux/user.slice';
import Logo from './../../../components/logo/Logo';

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { rc, auth, info } = await http.post('/login', values);

      if (rc?.code !== 0) {
        message.error(rc?.desc || 'Đăng nhập thất bại!');
        return;
      }

      const { access_token } = auth;
      const { username, is_active } = info;

      if (!is_active) {
        message.error('Tài khoản của bạn đã bị khóa!');
        localStorage.removeItem('user');
        return;
      }

      await dispatch(
        loggedInUser({
          token: access_token,
          username,
          is_active,
        }),
      );

      // save token to local storage
      localStorage.setItem('user', JSON.stringify({ token: access_token, username, is_active }));

      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      message.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
  };

  return (
    <Wrapper>
      <StyledCard
        title={
          <CardTitleContainer>
            <Logo />
            <LoginTitle>Đăng nhập</LoginTitle>
          </CardTitleContainer>
        }
      >
        <Form
          form={form}
          name="form-login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên tài khoản của bạn!' },
              { whitespace: true, message: 'Tên tài khoản không được chứa khoảng trắng!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
          >
            <Input.Password />
          </Form.Item>
          <WrapperButton>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!form.isFieldsTouched(true) || form.getFieldsError().some(({ errors }) => errors.length)}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </WrapperButton>
        </Form>
      </StyledCard>
    </Wrapper>
  );
}

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 1rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: none;
  background-color: #ffffff;

  @media (max-width: 576px) {
    padding: 1rem 0.5rem;
    border-radius: 0.75rem;
  }

  .ant-card-head {
    border-bottom: none;
    padding: 0;
  }

  .ant-card-body {
    padding: 1.5rem 1rem;

    @media (max-width: 576px) {
      padding: 1rem 0.5rem;
    }
  }
  .ant-form-item-label > label {
    font-weight: 500;
    color: #333;
  }
  .ant-input,
  .ant-input-password {
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #d9d9d9;

    &:hover {
      border-color: #1677ff;
    }

    &:focus {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
      outline: none;
    }
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    outline: none;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }

  @media (max-width: 576px) {
    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label > label {
      font-size: 14px;
    }

    .ant-input,
    .ant-input-password {
      padding: 0.4rem 0.6rem;
    }
  }
`;

const CardTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1.5rem 0;

  @media (max-width: 576px) {
    padding: 1rem 0;
  }
`;

const LoginTitle = styled.h4`
  padding-top: 1.25rem;
  font-size: 1.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  color: #222;
  margin-bottom: 0.5rem;

  @media (max-width: 576px) {
    padding-top: 1rem;
    font-size: 1.5rem;
  }
`;

const WrapperButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  .ant-btn {
    height: 45px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.5rem;
    width: 100%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }

    @media (max-width: 576px) {
      height: 40px;
      font-size: 0.9rem;
    }
  }
`;
