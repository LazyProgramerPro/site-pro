import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingProject, deleteProject, getProjectList, startEditingProject } from '../redux/project.slice';
import AddEditProjectForm from './AddEditProjectForm';
import ViewProject from './ViewProject';

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
    await dispatch(deleteProject(projectId));
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
    };
    await dispatch(getProjectList(filters));
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

  const columns = [
    {
      title: 'Mã dự án',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      fixed: 'left',
    },
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_at',
      key: 'start_at',
      width: '10%',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'finish_at',
      key: 'finish_at',
      width: '10%',
    },
    {
      title: 'Nhà thầu thi công',
      dataIndex: 'nha_thau_thi_cong_name',
      key: 'nha_thau_thi_cong_name',
      width: '10%',
    },
    {
      title: 'Tư vấn giám sát',
      dataIndex: 'tu_van_giam_sat_name',
      key: 'tu_van_giam_sat_name',
      width: '10%',
    },
    {
      title: 'Tư vấn thiết kế',
      dataIndex: 'tu_van_thiet_ke_name',
      key: 'tu_van_thiet_ke_name',
      width: '10%',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Xem chi tiết dự án" onClick={() => handleViewProject(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>

          <WrapperIcons title="Sửa dự án" onClick={() => handleEditProject(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa dự án">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa dự án này?"
              onConfirm={() => handleDeleteProject(record?.id)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </WrapperIcons>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle>Danh sách dự án</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Tìm kiếm dự án..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => dispatch(getProjectList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm dự án
          </Button>
        }
      >
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
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingProject?.id === record?.id ? 'active-row' : '')}
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
const PageTitle = styled.div`
  font-size: 32px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  width: 300px;
  margin-right: 10px;
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
`;

const WrapperIcons = styled.div`
  cursor: pointer;
`;
