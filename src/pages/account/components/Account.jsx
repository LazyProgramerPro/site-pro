import { SkeletonTable } from '@/components/table/SkeletonTable';
import getColor from '@/helpers/getColor';
import { useStyle } from '@/hooks/useStyle';
import { useAppDispatch } from '@/redux/store';
import { DeleteOutlined, EditOutlined, LockOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Popconfirm, Space, Table, Tag } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { cancelEditingAccount, deleteAccount, getAccountList, startEditingAccount } from '../redux/account.slice';
import AddEditAccountForm from './AddEditAccountForm';

export default function Account() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const accountList = useSelector((state) => state.account.accountList);
  const totalCount = useSelector((state) => state.account.totalCount);
  const loading = useSelector((state) => state.account.loading);

  const editingAccount = useSelector((state) => state.account.editingAccount);

  // pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
    };

    const promise = dispatch(getAccountList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);

  const showDrawer = (accountId) => {
    setOpen(true);
    dispatch(startEditingAccount(accountId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingAccount());
  };

  const handleDeleteAccount = async (accountId) => {
    await dispatch(deleteAccount({ id: accountId }));

    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
    };

    await dispatch(getAccountList(filters));
  };

  const handleEditAccount = (accountId) => {
    showDrawer(accountId);
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'username',
      key: 'username',
      width: '5%',
      fixed: 'left',

      //render avatar với chữ cái đầu tiên của username
      render: (text) => {
        return (
          <Avatar
            style={{
              backgroundColor: getColor(text?.charAt(0)),
              verticalAlign: 'middle',
            }}
            size="large"
          >
            {text?.charAt(0)?.toUpperCase() ?? 'T'}
          </Avatar>
        );
      },
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: '15%',
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15%',
    },
    {
      title: 'Doanh nghiệp & vị trí trong doanh nghiệp',
      dataIndex: 'company',
      key: 'company',
      width: '30%',
      // render mảng tên doanh nghiệp
      render: (company) => {
        return (
          <div>
            {company?.map((item, index) => {
              return (
                <Tag key={index} color="blue" style={{ margin: '5px' }}>
                  {item?.name} - {item?.position}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '10%',
      render: (role) => {
        const roleColors = {
          admin: 'red',
          cdt: 'blue',
          tvgs: 'green',
          nttc: 'orange',
          tvtk: 'purple',
        };

        return (
          <div>
            {role?.map((item, index) => {
              return (
                <Tag key={index} color={roleColors[item?.code]} style={{ margin: '5px' }}>
                  {item?.code}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '15%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Chỉnh sửa tài khoản" onClick={() => handleEditAccount(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Khóa tài khoản">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn khóa tài khoản này?"
              onConfirm={() => {}}
            >
              <LockOutlined />
            </Popconfirm>
          </WrapperIcons>

          <WrapperIcons title="Xóa tài khoản">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa tài khoản này?"
              onConfirm={() => handleDeleteAccount(record?.id)}
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
      <PageTitle>Danh sách người dùng</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Tìm người dùng ..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => dispatch(getAccountList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm người dùng
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
              dataSource={accountList}
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
              rowClassName={(record) => (editingAccount?.id === record?.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditAccountForm open={open} onClose={onClose} />}
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
