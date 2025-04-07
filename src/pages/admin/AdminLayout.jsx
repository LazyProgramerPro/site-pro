import {
  SettingOutlined,
  ProjectOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  BugOutlined,
  ScheduleOutlined,
  UserOutlined,
  ShopOutlined,
  BuildOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../components/logo/Logo";
import DropdownAvatar from "./components/DropdownAvatar";
import PageContent from "./components/PageContent";

const {
  Header: AntHeader,
  Content: AntContent,
  Footer: AntFooter,
  Sider,
} = Layout;

const items = [
  {
    key: "/dashboard/administration",
    label: "Quản trị",
    icon: <SettingOutlined style={{ fontSize: "16px" }} />,
    children: [
      {
        key: "/dashboard/administration/account",
        label: "Tài khoản",
        icon: <UserOutlined style={{ fontSize: "14px" }} />,
      },
      {
        key: "/dashboard/administration/business",
        label: "Doanh nghiệp",
        icon: <ShopOutlined style={{ fontSize: "14px" }} />,
      },
      {
        key: "/dashboard/administration/construction",
        label: "Công trình",
        icon: <BuildOutlined style={{ fontSize: "14px" }} />,
      },
      {
        key: "/dashboard/administration/category",
        label: "Hạng mục",
        icon: <AppstoreOutlined style={{ fontSize: "14px" }} />,
      },
      {
        key: "/dashboard/administration/group",
        label: "Nhóm",
        icon: <TeamOutlined style={{ fontSize: "14px" }} />,
      },
    ],
  },
  {
    key: "/dashboard/project",
    icon: <ProjectOutlined style={{ fontSize: "16px" }} />,
    label: "Dự án",
  },
  {
    key: "/dashboard/contract",
    icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
    label: "Hợp đồng",
  },
  {
    key: "/dashboard/acceptance-request",
    icon: <CheckSquareOutlined style={{ fontSize: "16px" }} />,
    label: "Yêu cầu nghiệm thu",
  },
  {
    key: "/dashboard/problem",
    icon: <BugOutlined style={{ fontSize: "16px" }} />,
    label: "Vấn đề",
  },
  {
    key: "/dashboard/construction-diary",
    icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
    label: "Nhật ký thi công",
  },
];
export default function AdminLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/dashboard");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <StyledLayout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(item) => {
            navigate(item.key);
          }}
          selectedKeys={[selectedKeys]}
          items={items}
        />
      </Sider>
      <Layout>
        <StyledHeader background={colorBgContainer}>
          <DropdownAvatar />
        </StyledHeader>
        <StyledContent>
          <ContentWrapper
            background={colorBgContainer}
            borderRadius={borderRadiusLG}
          >
            <PageContent />
          </ContentWrapper>
        </StyledContent>
        <StyledFooter>
          Site Pro ©{new Date().getFullYear()} Created by ThuongDev
        </StyledFooter>
      </Layout>
    </StyledLayout>
  );
}

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const LogoContainer = styled.div`
  height: 32px;
  margin: 16px;
`;

const StyledHeader = styled(AntHeader)`
  padding: 0 3rem;
  background: ${(props) => props.background};
  display: flex;
  justify-content: flex-end;
`;

const StyledContent = styled(AntContent)`
  margin: 24px 16px 0;
`;

const ContentWrapper = styled.div`
  padding: 24px;
  min-height: 100%;
  background: ${(props) => props.background};
  border-radius: ${(props) => props.borderRadius};
`;

const StyledFooter = styled(AntFooter)`
  text-align: center;
`;
