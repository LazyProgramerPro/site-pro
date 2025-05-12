import { ClockCircleOutlined, FileOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Descriptions, Divider, Drawer, Row, Space, Spin, Tabs, Timeline, Typography } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

const initialState = {};

const StyledCard = styled(Card)`
  border-radius: 8px;
  overflow: hidden;
`;

const MemberCard = styled(Card)`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const DocumentCard = styled(Card)`
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
`;

export default function ViewProject(props) {
  const { onClose, open } = props;
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.project.loading);
  const selectedProject = useSelector((state) => state.project.editingProject);
  console.log('editingProject:', selectedProject);
  useEffect(() => {
    setInitialValues(selectedProject || initialState);
  }, [selectedProject]);

  const items = [
    {
      key: '1',
      label: 'Mã dự án',
      children: selectedProject?.code || 'N/A',
    },
    {
      key: '2',
      label: 'Tên dự án',
      children: selectedProject?.name || 'N/A',
    },
    {
      key: '3',
      label: 'Mô tả',
      children: selectedProject?.description || 'N/A',
    },
    {
      key: '4',
      label: 'Ngày bắt đầu',
      children: selectedProject?.start_at || 'N/A',
    },
    {
      key: '5',
      label: 'Ngày kết thúc',
      children: selectedProject?.finish_at || 'N/A',
    },
    {
      key: '6',
      label: 'Nhà thầu thi công',
      children: selectedProject?.nha_thau_thi_cong_name || 'N/A',
    },
    {
      key: '7',
      label: 'Tư vấn giám sát',
      children: selectedProject?.tu_van_giam_sat_name || 'N/A',
    },
    {
      key: '8',
      label: 'Tư vấn thiết kế',
      children: selectedProject?.tu_van_thiet_ke_name || 'N/A',
    },
  ];

  // Mock data for the detail view
  const mockProjectMembers = [
    { name: 'Nguyễn Văn A', role: 'Giám đốc dự án', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Trần Thị B', role: 'Kỹ sư xây dựng', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Lê Văn C', role: 'Giám sát công trình', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Phạm Thị D', role: 'Kế toán dự án', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  const mockTimeline = [
    { time: '10/01/2023', title: 'Khởi động dự án', description: 'Bắt đầu khởi động dự án với các bên liên quan' },
    { time: '15/02/2023', title: 'Hoàn thành thiết kế', description: 'Hoàn thành thiết kế chi tiết và phê duyệt' },
    { time: '05/03/2023', title: 'Bắt đầu thi công', description: 'Nhà thầu bắt đầu thi công phần móng' },
    { time: '20/04/2023', title: 'Kiểm tra tiến độ', description: 'Kiểm tra và điều chỉnh tiến độ dự án' },
    { time: '15/05/2023', title: 'Hoàn thành 30%', description: 'Dự án đã hoàn thành 30% công việc' },
  ];

  const mockDocuments = [
    { name: 'Hợp đồng thi công.pdf', type: 'pdf', size: '2.5MB', date: '10/01/2023' },
    { name: 'Bản vẽ thiết kế.dwg', type: 'dwg', size: '15MB', date: '15/02/2023' },
    { name: 'Báo cáo tiến độ tháng 3.xlsx', type: 'xlsx', size: '1.2MB', date: '05/04/2023' },
    { name: 'Biên bản nghiệm thu giai đoạn 1.pdf', type: 'pdf', size: '3MB', date: '20/04/2023' },
  ];

  // Tabs for the detail view
  const tabItems = [
    {
      key: '1',
      label: 'Thông tin chung',
      children: <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }} items={items} />,
    },
    {
      key: '2',
      label: 'Thành viên',
      children: (
        <StyledCard>
          <Title level={4}>
            <TeamOutlined /> Thành viên dự án
          </Title>
          <Row gutter={[16, 16]}>
            {mockProjectMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <MemberCard>
                  <Space>
                    <Avatar size={64} src={member.avatar} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {member.name}
                      </Title>
                      <Text type="secondary">{member.role}</Text>
                    </div>
                  </Space>
                </MemberCard>
              </Col>
            ))}
          </Row>
        </StyledCard>
      ),
    },
    {
      key: '3',
      label: 'Tiến độ',
      children: (
        <StyledCard>
          <Title level={4}>
            <ClockCircleOutlined /> Tiến độ dự án
          </Title>
          <Row gutter={16}>
            <Col span={24}>
              <Card>
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                      35%
                    </Title>
                    <Paragraph style={{ textAlign: 'center' }}>Hoàn thành</Paragraph>
                  </Col>
                  <Col span={16}>
                    <Paragraph>
                      <Text strong>Bắt đầu:</Text> {selectedProject?.start_at || 'N/A'}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Kết thúc dự kiến:</Text> {selectedProject?.end_at || 'N/A'}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Trạng thái:</Text> <Text type="success">Đúng tiến độ</Text>
                    </Paragraph>
                  </Col>
                </Row>
              </Card>

              <Divider orientation="left">Lịch sử dự án</Divider>

              <Timeline
                mode="left"
                items={mockTimeline.map((item) => ({
                  label: item.time,
                  children: (
                    <>
                      <Text strong>{item.title}</Text>
                      <Paragraph>{item.description}</Paragraph>
                    </>
                  ),
                }))}
              />
            </Col>
          </Row>
        </StyledCard>
      ),
    },
    {
      key: '4',
      label: 'Tài liệu',
      children: (
        <StyledCard>
          <Title level={4}>
            <FileOutlined /> Tài liệu dự án
          </Title>
          <Row gutter={[16, 16]}>
            {mockDocuments.map((doc, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <DocumentCard>
                  <FileOutlined style={{ fontSize: 24, marginRight: 12 }} />
                  <div>
                    <Paragraph strong style={{ margin: 0 }}>
                      {doc.name}
                    </Paragraph>
                    <Text type="secondary">
                      {doc.size} • {doc.date}
                    </Text>
                  </div>
                </DocumentCard>
              </Col>
            ))}
          </Row>
        </StyledCard>
      ),
    },
  ];

  return (
    <Drawer
      width={window.innerWidth > 768 ? 1000 : '100%'}
      title={
        <Space align="center">
          <Avatar icon={<ProjectOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <span>Chi tiết dự án: {initialValues?.code || 'N/A'}</span>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin dự án..." />
        </div>
      ) : (
        <Tabs defaultActiveKey="1" items={tabItems} />
      )}
    </Drawer>
  );
}
