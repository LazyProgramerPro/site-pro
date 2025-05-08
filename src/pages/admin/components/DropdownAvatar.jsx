import { logOut } from '@/pages/auth/redux/user.slice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { FileOutlined, LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import styled from 'styled-components';
import ResetPasswordModal from './ResetPasswordModal';

const DropdownAvatar = () => {
  const dispatch = useDispatch();

  const items = [
    {
      key: '1',
      icon: <ProfileOutlined />,
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Hồ sơ
        </a>
      ),
    },

    {
      key: '2',
      icon: <FileOutlined />,
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Tài liệu của tôi
        </a>
      ),
    },

    {
      key: '3',
      label: (
        <>
          <ResetPasswordModal />
        </>
      ),
    },

    {
      key: '4',
      icon: <LogoutOutlined />,
      label: (
        <a
          onClick={() => {
            dispatch(logOut()); // Dispatch the logout action
            console.log('Logging out...');
            localStorage.removeItem('user'); // Remove user from local storage
            toast.success('Đăng xuất thành công!');
          }}
        >
          Đăng xuất
        </a>
      ),
    },
  ];

  return (
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
};

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
