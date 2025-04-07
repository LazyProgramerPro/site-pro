import { SettingOutlined } from "@ant-design/icons";
import { Form, Input, Modal } from "antd";
import { useState } from "react";
import styled from "styled-components";

const TriggerContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const ResetPasswordModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const onFinish = () => {};
  const onFinishFailed = () => {};

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <TriggerContainer onClick={showModal}>
        <SettingOutlined />
        <div>Đổi mật khẩu</div>
      </TriggerContainer>

      <Modal
        title="Thay đổi mật khẩu"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Hủy bỏ"
        okText="Cập nhật"
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
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
