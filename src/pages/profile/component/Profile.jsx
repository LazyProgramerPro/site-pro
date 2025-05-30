import getColor from '@/helpers/getColor';
import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  EditOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, Descriptions, Divider, Row, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text } = Typography;

const ProfileContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;
`;

const ProfileWrapper = styled.div`
  width: 100%;
  max-width: 960px;
`;

const BackButton = styled(Button)`
  margin-bottom: 16px;
`;

const ProfileCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 40px 24px 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const AvatarContainer = styled.div`
  margin-bottom: 16px;
  position: relative;
`;

const EditAvatarButton = styled(Button)`
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
`;

const InfoCard = styled(Card)`
  border-radius: 8px;
  margin-top: -48px;
  z-index: 1;
  position: relative;
`;

const UserTitle = styled(Title)`
  color: white !important;
  margin-bottom: 4px !important;
`;

const UserSubTitle = styled(Text)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
`;

const StyledTag = styled(Tag)`
  margin: 4px;
  padding: 4px 8px;
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-weight: 500;
  }
`;

const CompanyCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #1890ff;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

export default function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    displayName: 'Thuong Dev',
    initial: 'T',
  });

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const getUserFromStorage = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      try {
        const user = JSON.parse(userStr);

        setUserData(user);
      } catch (error) {
        console.error('Lỗi khi parse thông tin người dùng từ localStorage:', error);
      }
    };

    getUserFromStorage();
  }, []);

  // Giả sử userData là dữ liệu người dùng đã được lấy từ Redux store

  const handleEditAvatar = () => {
    message.info('Tính năng đang được phát triển');
  };

  const handleEditProfile = () => {
    message.info('Tính năng đang được phát triển');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <ProfileContainer>
      <ProfileWrapper>
        <BackButton type="primary" ghost icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay về Dashboard
        </BackButton>

        <ProfileCard bordered={false}>
          <HeaderSection>
            <AvatarContainer>
              <Badge count={<EditAvatarButton type="primary" icon={<EditOutlined />} onClick={handleEditAvatar} />}>
                <Avatar
                  size={100}
                  icon={<UserOutlined />}
                  src={userData.avatar_url}
                  style={{
                    backgroundColor: userData.avatar_url
                      ? 'transparent'
                      : getColor(userData.full_name?.[0] || userData.username?.[0]),
                    fontSize: '48px',
                    border: '4px solid white',
                  }}
                >
                  {!userData.avatar_url && (userData.full_name?.[0] || userData.username?.[0])?.toUpperCase()}
                </Avatar>
              </Badge>
            </AvatarContainer>
            <UserTitle level={3}>{userData.full_name}</UserTitle>
            <UserSubTitle>{userData.company?.[0]?.position || 'Chưa cập nhật chức vụ'}</UserSubTitle>
          </HeaderSection>

          <InfoCard>
            <Row>
              <Col xs={24} md={16}>
                <StyledDescriptions column={{ xs: 1, sm: 2 }} layout="vertical" bordered>
                  <Descriptions.Item
                    label={
                      <>
                        <IdcardOutlined /> Tên đăng nhập
                      </>
                    }
                  >
                    {userData.username}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <MailOutlined /> Email
                      </>
                    }
                  >
                    {userData.email || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <PhoneOutlined /> Số điện thoại
                      </>
                    }
                  >
                    {userData.phone_number || 'Chưa cập nhật'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <CalendarOutlined /> Ngày tham gia
                      </>
                    }
                  >
                    {dayjs(userData.created_at).format('DD/MM/YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <CalendarOutlined /> Lần đăng nhập cuối
                      </>
                    }
                    span={2}
                  >
                    {userData.last_login ? dayjs(userData.last_login).format('DD/MM/YYYY HH:mm') : 'Chưa có thông tin'}
                  </Descriptions.Item>
                </StyledDescriptions>

                <Button type="primary" icon={<EditOutlined />} style={{ marginTop: 16 }} onClick={handleEditProfile}>
                  Chỉnh sửa thông tin
                </Button>
              </Col>

              <Col xs={24} md={8} style={{ paddingLeft: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <Title level={5}>
                    <TeamOutlined /> Vai trò
                  </Title>
                  <Space wrap>
                    {userData.role?.map((role) => (
                      <StyledTag color="blue" key={role.id}>
                        {role.name}
                      </StyledTag>
                    ))}
                  </Space>
                </div>

                <Divider />

                <div>
                  <Title level={5}>
                    <BankOutlined /> Công ty
                  </Title>
                  {userData.company?.map((company) => (
                    <CompanyCard key={company.id}>
                      <Space direction="vertical" size={0}>
                        <Text strong>{company.name}</Text>
                        <Text type="secondary">Mã: {company.code}</Text>
                        <Text type="secondary">Chức vụ: {company.position}</Text>
                      </Space>
                    </CompanyCard>
                  ))}
                </div>
              </Col>
            </Row>
          </InfoCard>
        </ProfileCard>
      </ProfileWrapper>
    </ProfileContainer>
  );
}
