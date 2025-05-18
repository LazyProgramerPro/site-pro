import { SkeletonTable } from '@/components/table/SkeletonTable';
import { formatDate } from '@/helpers/formatDate';
import { useStyle } from '@/hooks/useStyle';
import { useAppDispatch } from '@/redux/store';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Modal, Row, Space, Table, Typography, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { cancelEditingProject, deleteProject, getProjectList, startEditingProject } from '../redux/project.slice';
import AddEditProjectForm from './AddEditProjectForm';
import ViewProject from './ViewProject';

const { Title } = Typography;

export default function Project() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDetail, setOpenDetail] = useState(false);

  const projectList = useSelector((state) => state.project.projectList);
  const totalCount = useSelector((state) => state.project.totalCount);
  const loading = useSelector((state) => state.project.loading);

  const editingProject = useSelector((state) => state.project.editingProject);
  console.log('editingProject1:', editingProject);

  const dispatch = useAppDispatch();

  // pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
    };
    const promise = dispatch(getProjectList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);

  const showDrawer = (projectId) => {
    setOpen(true);
    dispatch(startEditingProject(projectId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingProject());
  };
  const handleDeleteProject = async (projectId) => {
    try {
      await dispatch(deleteProject(projectId)).unwrap();

      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };

      await dispatch(getProjectList(filters));
      message.success('Xóa dự án thành công');
    } catch (error) {
      console.error('Lỗi khi xóa dự án:', error);
      message.error('Xóa dự án thất bại. Vui lòng thử lại!');
    }
  };

  const handleEditProject = (projectId) => {
    showDrawer(projectId);
  };

  const handleViewProject = (projectId) => {
    setOpenDetail(true);
    dispatch(startEditingProject(projectId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingProject());
  };

  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(getProjectList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }));
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa dự án',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa dự án này?</p>
          <p>
            <strong>Mã dự án:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên dự án:</strong> {record?.name}
          </p>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            CẢNH BÁO: Việc xóa dự án sẽ xóa tất cả công trình, hạng mục và nhóm hạng mục liên quan.
          </p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteProject(record?.id),
      width: 550,
    });
  };
  const columns = [
    {
      title: 'Mã dự án',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (text, record) => (
        <Space>
          <ProjectOutlined style={{ color: '#1890ff' }} />
          <Typography.Text>{text}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      render: (text) => {
        if (!text) return <Typography.Text type="secondary">Chưa có mô tả</Typography.Text>;
        return <Typography.Text ellipsis={{ tooltip: text }}>{text}</Typography.Text>;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_at',
      key: 'start_at',
      width: '10%',
      render: (text) => (
        <Typography.Text>
          {text ? formatDate(text) : <span className="text-secondary">Chưa cập nhật</span>}
        </Typography.Text>
      ),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'finish_at',
      key: 'finish_at',
      width: '10%',
      render: (text) => (
        <Typography.Text>
          {text ? formatDate(text) : <span className="text-secondary">Chưa cập nhật</span>}
        </Typography.Text>
      ),
    },
    {
      title: 'Nhà thầu thi công',
      dataIndex: 'nha_thau_thi_cong_name',
      key: 'nha_thau_thi_cong_name',
      width: '10%',
      render: (text) => {
        if (!text) return <Typography.Text type="secondary">Chưa phân công</Typography.Text>;
        return <Typography.Text>{text}</Typography.Text>;
      },
    },
    {
      title: 'Tư vấn giám sát',
      dataIndex: 'tu_van_giam_sat_name',
      key: 'tu_van_giam_sat_name',
      width: '10%',
      render: (text) => {
        if (!text) return <Typography.Text type="secondary">Chưa phân công</Typography.Text>;
        return <Typography.Text>{text}</Typography.Text>;
      },
    },
    {
      title: 'Tư vấn thiết kế',
      dataIndex: 'tu_van_thiet_ke_name',
      key: 'tu_van_thiet_ke_name',
      width: '10%',
      render: (text) => {
        if (!text) return <Typography.Text type="secondary">Chưa phân công</Typography.Text>;
        return <Typography.Text>{text}</Typography.Text>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <ActionButton title="Xem chi tiết dự án" onClick={() => handleViewProject(record?.id)}>
            <EyeOutlined className="action-icon view-icon" />
          </ActionButton>
          <ActionButton title="Sửa dự án" onClick={() => handleEditProject(record?.id)}>
            <EditOutlined className="action-icon" />
          </ActionButton>{' '}
          <ActionButton title="Xóa dự án" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="action-icon delete-icon" />
          </ActionButton>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách dự án</Title>
        <Typography.Text type="secondary">Quản lý thông tin dự án trong hệ thống</Typography.Text>
      </PageHeader>

      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm dự án theo mã hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => dispatch(getProjectList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm dự án
            </Button>
          </Col>
        </SearchContainer>

        {loading && (
          <Fragment>
            <SkeletonTable />
          </Fragment>
        )}

        {!loading && (
          <TableContainer>
            <Table
              className={styles.customTable}
              columns={columns}
              dataSource={projectList}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },
                hideOnSinglePage: false,
                current: page,
                total: totalCount,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total) => `Tổng số ${total} dự án`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingProject?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditProjectForm open={open} onClose={onClose} />}
      {openDetail && <ViewProject open={openDetail} onClose={handleCloseDetail} />}
    </>
  );
}

// Styled components for layout elements
const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const SearchContainer = styled(Row)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled(Input)`
  width: 400px;
  margin-right: 12px;
  border-radius: 4px;

  &.ant-input-affix-wrapper:focus,
  &.ant-input-affix-wrapper-focused {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;

  .active-row {
    background-color: #e6f7ff;
    border-left: 3px solid #1890ff;

    td {
      background-color: #e6f7ff !important; /* Force the background on all cells */
    }
  }

  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  .ant-pagination {
    margin-top: 16px;
  }
`;

const ActionButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  .action-icon {
    color: #1890ff;
    font-size: 16px;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .view-icon {
    color: #52c41a;
  }

  .delete-icon {
    color: #ff4d4f;

    &:hover {
      color: #ff7875;
    }
  }
`;
