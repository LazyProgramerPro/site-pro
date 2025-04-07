import { Button, Card, Form, Input } from "antd";
import { useState } from "react";
import styled from "styled-components";
import Wrapper from "../../../assets/wrappers/Login";
import Logo from "./../../../components/logo/Logo";

export default function Login() {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = () => {};
  const onFinishFailed = () => {};

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
          initialValues={{
            email: localStorage.getItem("emailForRegistration"),
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn!" },
            ]}
          >
            <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
            ]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>
          <WrapperButton>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!email || !password}
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
