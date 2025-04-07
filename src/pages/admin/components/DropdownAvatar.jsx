import {
  FileOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Space } from "antd";
import styled from "styled-components";
import ResetPasswordModal from "./ResetPasswordModal";

const items = [
  {
    key: "1",
    icon: <ProfileOutlined />,
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Hồ sơ
      </a>
    ),
  },

  {
    key: "2",
    icon: <FileOutlined />,
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Tài liệu của tôi
      </a>
    ),
  },

  {
    key: "3",
    label: (
      <>
        <ResetPasswordModal />
      </>
    ),
  },

  {
    key: "4",
    icon: <LogoutOutlined />,
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        Đăng xuất
      </a>
    ),
  },
];

const DropdownAvatar = () => (
  <AvatarContainer>
    <GreetingText>Hi, Thuong Dev</GreetingText>
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar size="default" icon={<UserOutlined />} />
        </Space>
      </a>
    </Dropdown>
  </AvatarContainer>
);

export default DropdownAvatar;

// Styled Components
const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GreetingText = styled.div`
  margin-right: 10px;
  font-size: 16px;
  color: #333;
`;
