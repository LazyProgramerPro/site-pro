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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Use useNavigate hook

  const onFinish = async (values) => {
    try {
      const { rc, auth } = await http.post('/login', values);

      if (rc?.code !== 0) {
        message.error(rc?.desc || 'Đăng nhập thất bại!');
        return;
      } else {
        const { access_token } = auth;

        // TODO: call api get permission
        // const { rc, data } = await http.get('/user/permission', {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        // });
        // if (rc?.code !== 0) {  
        //   message.error(rc?.desc || 'Lỗi không xác định!');
        //   return;
        // }
        // const { permission } = data;
        // console.log('permission:', permission);

        await dispatch(
          loggedInUser({
            token: access_token,
          }),
        );

        // save token to local storage
        localStorage.setItem('user', JSON.stringify({ token: access_token }));

        message.success('Đăng nhập thành công!');
        navigate('/dashboard'); // Navigate to dashboard
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const onFinishFailed = () => {
    message.error('Đăng nhập thất bại!');
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
          // initialValues={{
          //   username: 'sitepro-admin',
          //   password: 'abc@123',
          // }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Tên tài khoản"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản của bạn!' }]}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <WrapperButton>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!username || !password}>
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
  border-radius: 0.6rem;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  padding: 1rem;
`;

const CardTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
`;

const LoginTitle = styled.h4`
  padding-top: 1rem;
  font-size: 1.5rem;
  margin-left: 0.5rem;
  color: #333;
`;

const WrapperButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
