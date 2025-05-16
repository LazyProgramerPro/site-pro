import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingGroup, deleteGroup, getGroupList, startEditingGroup } from '../redux/group.slice';
import AddEditGroupForm from './AddEditGroupForm';

export default function Group() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);

  const groupList = useSelector((state) => state.group.groupList);
  const loading = useSelector((state) => state.group.loading);

  const editingGroup = useSelector((state) => state.group.editingGroup);
  console.log('editingGroup1:', editingGroup);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getGroupList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (groupId) => {
    setOpen(true);
    dispatch(startEditingGroup(groupId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingGroup());
  };

  const handleDeleteGroup = (groupId) => {
    dispatch(deleteGroup(groupId));
  };

  const handleEditGroup = (groupId) => {
    showDrawer(groupId);
  };

  const columns = [
    {
      title: 'Mã nhóm',
      dataIndex: 'groupCode',
      key: 'groupCode',
      width: '30%',
      fixed: 'left',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'groupName',
      key: 'groupName',
      width: '30%',
    },
    {
      title: 'Hạng mục',
      dataIndex: 'category',
      key: 'category',
      width: '30%',
    },

    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Sửa nhóm hạng mục" onClick={() => handleEditGroup(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa nhóm hạng mục">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa nhóm này?"
              onConfirm={() => handleDeleteGroup(record?.id)}
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
      <PageTitle>Danh sách nhóm hạng mục</PageTitle>
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
            Thêm nhóm hạng mục
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
              dataSource={groupList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingGroup?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditGroupForm open={open} onClose={onClose} />}
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
