import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import {
  cancelEditingConstructionDiary,
  deleteConstructionDiary,
  getConstructionDiaryList,
  startEditingConstructionDiary,
} from '../redux/constructionDiary.slice';
import AddEditConstructionDiaryForm from './AddEditConstructionDiaryForm';
import ViewConstructionDiary from './ViewConstructionDiary';

export default function ConstructionDiary() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const constructionDiaryList = useSelector((state) => state.constructionDiary.constructionDiaryList);
  const loading = useSelector((state) => state.constructionDiary.loading);

  const editingConstructionDiary = useSelector((state) => state.constructionDiary.editingConstructionDiary);
  console.log('editingConstructionDiary:', editingConstructionDiary);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getConstructionDiaryList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (constructionDiaryId) => {
    setOpen(true);
    dispatch(startEditingConstructionDiary(constructionDiaryId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingConstructionDiary());
  };

  const handleDeleteConstructionDiary = (constructionDiaryId) => {
    dispatch(deleteConstructionDiary(constructionDiaryId));
  };

  const handleEditConstructionDiary = (constructionDiaryId) => {
    showDrawer(constructionDiaryId);
  };

  const handleViewConstructionDiary = (constructionDiaryId) => {
    setOpenDetail(true);
    dispatch(startEditingConstructionDiary(constructionDiaryId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingConstructionDiary());
  };

  const columns = [
    {
      title: 'Mã nhật ký',
      dataIndex: 'diaryCode',
      key: 'diaryCode',
      width: '10%',
      fixed: 'left',
    },
    {
      title: 'Tên nhật ký',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Tên dự án',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '15%',
    },
    {
      title: 'Công trình',
      dataIndex: 'construction',
      key: 'construction',
      width: '8%',
    },
    {
      title: 'Loại nhật ký',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      render: (status) => {
        let color = 'green';
        if (status === 'Mới tạo') {
          color = 'orange';
        } else if (status === 'Đang xem xét') {
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
          <WrapperIcons title="Xem chi tiết nhật ký" onClick={() => handleViewConstructionDiary(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>

          <WrapperIcons title="Sửa nhật ký" onClick={() => handleEditConstructionDiary(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa nhật ký">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa nhật ký này?"
              onConfirm={() => handleDeleteConstructionDiary(record?.id)}
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
      <PageTitle>Danh sách nhật ký thi công</PageTitle>
      <Card
        title={
          <>
            <Select style={{ width: 200, marginRight: 10 }} defaultValue="all" placeholder="Tên dự án">
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="active">Đang hoạt động</Select.Option>
            </Select>
            <SearchInput placeholder="Search..." />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {}}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm nhật ký
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
              dataSource={constructionDiaryList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingConstructionDiary?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditConstructionDiaryForm open={open} onClose={onClose} />}
      {openDetail && <ViewConstructionDiary open={openDetail} onClose={handleCloseDetail} />}
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
