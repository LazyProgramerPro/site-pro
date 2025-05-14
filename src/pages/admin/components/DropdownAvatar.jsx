import { FileOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, message, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import getColor from '@/helpers/getColor';
import { logOut } from '@/pages/auth/redux/user.slice';
import { useAppDispatch } from '@/redux/store';
import ResetPasswordModal from './ResetPasswordModal';

const DropdownAvatar = () => {
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = useState({
    displayName: 'Thuong Dev',
    initial: 'T',
  });

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const getUserFromStorage = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      try {
        const userData = JSON.parse(userStr);
        const displayName = userData.fullName || userData.full_name || userData.name || userData.username || 'User';
        const initial = (userData.username || displayName)?.charAt(0) || 'T';

        setUserProfile({ displayName, initial });
      } catch (error) {
        console.error('Lỗi khi parse thông tin người dùng từ localStorage:', error);
      }
    };

    getUserFromStorage();
  }, []);
  // Tạo items menu cho dropdown với useMemo để tránh tính toán lại không cần thiết
  const items = useMemo(
    () => [
      {
        key: 'profile',
        icon: <ProfileOutlined />,
        label: <a href="/profile">Hồ sơ</a>,
      },
      {
        key: 'documents',
        icon: <FileOutlined />,
        label: <a href="/documents">Tài liệu của tôi</a>,
      },
      {
        key: 'reset-password',
        label: <ResetPasswordModal />,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: (
          <a
            onClick={() => {
              dispatch(logOut());
              localStorage.removeItem('user');
              message.success('Đăng xuất thành công!');
            }}
          >
            Đăng xuất
          </a>
        ),
      },
    ],
    [dispatch],
  );
  // Handler cho việc prevent default click
  const handleDropdownClick = (e) => e.preventDefault();

  return (
    <AvatarContainer>
      <GreetingText>Xin chào, {userProfile.displayName}</GreetingText>
      <Dropdown menu={{ items }}>
        <a onClick={handleDropdownClick}>
          <Space>
            <Avatar
              style={{
                backgroundColor: getColor(userProfile.initial),
                verticalAlign: 'middle',
              }}
              size="default"
            >
              {userProfile.initial?.toUpperCase()}
            </Avatar>
          </Space>
        </a>
      </Dropdown>
    </AvatarContainer>
  );
};

// Styled Components
const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
`;

const GreetingText = styled.div`
  margin-right: 10px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

export default DropdownAvatar;
