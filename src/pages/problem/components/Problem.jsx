import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table, Tag } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingProblem, deleteProblem, getProblemList, startEditingProblem } from '../redux/problem.slice';
import AddEditProblemForm from './AddEditProblemForm';
import ViewProblem from './ViewProblem';

export default function Problem() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);

  const problemList = useSelector((state) => state.problem.problemList);
  const loading = useSelector((state) => state.problem.loading);

  const editingProblem = useSelector((state) => state.problem.editingProblem);
  console.log('editingProblem1:', editingProblem);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getProblemList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (problemId) => {
    setOpen(true);
    dispatch(startEditingProblem(problemId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingProblem());
  };

  const handleDeleteProblem = (problemId) => {
    dispatch(deleteProblem(problemId));
  };

  const handleEditProblem = (problemId) => {
    showDrawer(problemId);
  };

  const handleViewProblem = (problemId) => {
    setOpenDetail(true);
    dispatch(startEditingProblem(problemId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingProblem());
  };

  const columns = [
    {
      title: 'Mã vấn đề',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      fixed: 'left',
    },
    {
      title: 'Tên vấn đề',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Loại vấn đề',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: 'Dự án',
      dataIndex: 'project',
      key: 'project',
      width: '10%',
    },
    {
      title: 'Phụ lục hợp đồng',
      dataIndex: 'contractAppendix',
      key: 'contractAppendix',
      width: '10%',
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
      width: '10%',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      //render tag status
      render: (status) => {
        let color = 'green';
        if (status === 'Đang xử lý') {
          color = 'orange';
        } else if (status === 'Đã giải quyết') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Xem chi tiết vấn đề" onClick={() => handleViewProblem(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>
          <WrapperIcons title="Xóa vấn đề">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa vấn đề này?"
              onConfirm={() => handleDeleteProblem(record?.id)}
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
      <PageTitle>Danh sách vấn đề</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {}}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm vấn đề
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
              dataSource={problemList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingProblem?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditProblemForm open={open} onClose={onClose} />}
      {openDetail && <ViewProblem open={openDetail} onClose={handleCloseDetail} />}
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
