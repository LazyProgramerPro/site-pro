import { SkeletonTable } from '@/components/table/SkeletonTable';
import getColor from '@/helpers/getColor';
import { useStyle } from '@/hooks/useStyle';
import { useAppDispatch } from '@/redux/store';
import http from '@/utils/http';
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  LockOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Input, Modal, Row, Space, Table, Tag, Tooltip, Typography, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { cancelEditingAccount, deleteAccount, getAccountList, startEditingAccount } from '../redux/account.slice';
import AddEditAccountForm from './AddEditAccountForm';

const { Title } = Typography;

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
    try {
      await dispatch(deleteAccount(accountId)).unwrap();

      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };

      await dispatch(getAccountList(filters));
      message.success('Xóa tài khoản thành công');
    } catch (error) {
      console.error('Lỗi khi xóa tài khoản:', error);
      message.error('Xóa tài khoản thất bại. Vui lòng thử lại!');
    }
  };

  const handleEditAccount = (accountId) => {
    showDrawer(accountId);
  };
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  // Hiển thị modal xác nhận xóa tài khoản
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa tài khoản này?</p>
          <p>
            <strong>Tên đăng nhập:</strong> {record?.username}
          </p>
          <p>
            <strong>Họ tên:</strong> {record?.full_name}
          </p>
          <p style={{ color: '#ff4d4f' }}>Lưu ý: Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteAccount(record?.id),
      width: 500,
    });
  };

  // Hiển thị modal xác nhận khóa/mở khóa tài khoản
  const showLockUnlockConfirm = (record) => {
    Modal.confirm({
      title: record?.is_active ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản',
      icon: <QuestionCircleOutlined style={{ color: record?.is_active ? '#ff4d4f' : '#52c41a' }} />,
      content: (
        <div>
          <p>
            {record?.is_active
              ? 'Bạn có chắc chắn muốn khóa tài khoản này?'
              : 'Bạn có chắc chắn muốn mở khóa tài khoản này?'}
          </p>
          <p>
            <strong>Tên đăng nhập:</strong> {record?.username}
          </p>
          <p>
            <strong>Họ tên:</strong> {record?.full_name}
          </p>
          {record?.is_active && (
            <p style={{ color: '#ff4d4f' }}>Khi bị khóa, người dùng sẽ không thể đăng nhập vào hệ thống.</p>
          )}
        </div>
      ),
      okText: record?.is_active ? 'Khóa' : 'Mở khóa',
      okButtonProps: {
        danger: record?.is_active,
        type: record?.is_active ? 'primary' : 'default',
      },
      cancelText: 'Hủy bỏ',
      onOk: () => {
        if (record?.is_active) {
          handleLockAccount(record?.id);
        } else {
          handleUnlockAccount(record?.id);
        }
      },
      width: 500,
    });
  };

  // Hiển thị modal xác nhận đặt lại mật khẩu
  const showResetPasswordConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận đặt lại mật khẩu',
      icon: <QuestionCircleOutlined style={{ color: '#faad14' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này?</p>
          <p>
            <strong>Tên đăng nhập:</strong> {record?.username}
          </p>
          <p>
            <strong>Họ tên:</strong> {record?.full_name}
          </p>
          <p style={{ color: '#faad14' }}>Mật khẩu mới sẽ được gửi tới email liên kết với tài khoản này.</p>
        </div>
      ),
      okText: 'Đặt lại',
      okButtonProps: {
        type: 'primary',
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleResetPassword(record?.id, record?.username),
      width: 500,
    });
  };
  const handleLockAccount = async (accountId) => {
    try {
      await http.post('/auth/user/lock', { id: accountId });

      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };

      await dispatch(getAccountList(filters));
      message.success('Khóa tài khoản thành công');
    } catch (error) {
      console.error('Lỗi khi khóa tài khoản:', error);
      message.error('Khóa tài khoản thất bại. Vui lòng thử lại!');
    }
  };
  const handleUnlockAccount = async (accountId) => {
    try {
      await http.post('/auth/user/unlock', { id: accountId });

      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };

      await dispatch(getAccountList(filters));
      message.success('Mở khóa tài khoản thành công');
    } catch (error) {
      console.error('Lỗi khi mở khóa tài khoản:', error);
      message.error('Mở khóa tài khoản thất bại. Vui lòng thử lại!');
    }
  };

  const handleResetPassword = async (accountId, userName) => {
    try {
      await http.post('/auth/user/reset-password', { id: accountId, username: userName });
      message.success('Đặt lại mật khẩu thành công');
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      message.error('Đặt lại mật khẩu thất bại. Vui lòng thử lại!');
    }
  };

  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(getAccountList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }));
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'username',
      key: 'username',
      width: '5%',
      fixed: 'left',
      render: (text) => {
        return (
          <Avatar
            style={{
              backgroundColor: getColor(text?.charAt(0)),
              verticalAlign: 'middle',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
            size="large"
          >
            {text?.charAt(0)?.toUpperCase() ?? <UserOutlined />}
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
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
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
      render: (company) => {
        if (!company?.length) return <Typography.Text type="secondary">Chưa có thông tin</Typography.Text>;
        return (
          <TagsContainer>
            {company?.map((item, index) => (
              <Tag key={index} color="blue" className="company-tag">
                <b>{item?.name}</b> {item?.position ? `- ${item?.position}` : ''}
              </Tag>
            ))}
          </TagsContainer>
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

        if (!role?.length) return <Typography.Text type="secondary">Chưa phân quyền</Typography.Text>;

        return (
          <TagsContainer>
            {role?.map((item, index) => (
              <Tooltip key={index} title={getRoleFullName(item?.code)}>
                <Tag color={roleColors[item?.code] || 'default'} className="role-tag">
                  {item?.code?.toUpperCase()}
                </Tag>
              </Tooltip>
            ))}
          </TagsContainer>
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
          <ActionButton title="Chỉnh sửa tài khoản" onClick={() => handleEditAccount(record?.id)}>
            <EditOutlined className="action-icon" />
          </ActionButton>{' '}
          <ActionButton
            title={record?.is_active ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
            onClick={() => showLockUnlockConfirm(record)}
          >
            {record?.is_active ? (
              <LockOutlined className="action-icon" />
            ) : (
              <LockOutlined className="action-icon action-icon-disabled" />
            )}
          </ActionButton>{' '}
          <ActionButton title="Đặt lại mật khẩu" onClick={() => showResetPasswordConfirm(record)}>
            <KeyOutlined className="action-icon" />
          </ActionButton>{' '}
          <ActionButton title="Xóa tài khoản" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="action-icon delete-icon" />
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách người dùng</Title>
        <Typography.Text type="secondary">Quản lý tài khoản người dùng và phân quyền trong hệ thống</Typography.Text>
      </PageHeader>

      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm theo tên đăng nhập, email hoặc tên người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => dispatch(getAccountList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm người dùng
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
                showTotal: (total) => `Tổng số ${total} người dùng`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingAccount?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditAccountForm open={open} onClose={onClose} />}
    </>
  );
}

// Hàm hỗ trợ
const getRoleFullName = (code) => {
  const roleMap = {
    admin: 'Quản trị viên',
    cdt: 'Chủ đầu tư',
    tvgs: 'Tư vấn giám sát',
    nttc: 'Nhà thầu thi công',
    tvtk: 'Tư vấn thiết kế',
  };

  return roleMap[code] || code;
};

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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  .company-tag,
  .role-tag {
    margin: 0;
    display: inline-flex;
    align-items: center;
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

  .action-icon-disabled {
    color: #ff4d4f;
    opacity: 0.6;
    transform: rotate(45deg);
  }

  .delete-icon {
    color: #ff4d4f;

    &:hover {
      color: #ff7875;
    }
  }
`;
