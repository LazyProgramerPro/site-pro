import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Modal, Space, Table, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingGroup, deleteGroup, getGroupList, startEditingGroup } from '../redux/group.slice';
import AddEditGroupForm from './AddEditGroupForm';

const { Title } = Typography;

export default function Group() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const groupList = useSelector((state) => state.group.groupList);
  const totalCount = useSelector((state) => state.group.totalCount);
  const loading = useSelector((state) => state.group.loading);
  const editingGroup = useSelector((state) => state.group.editingGroup);

  // Phân trang
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
    };
    const promise = dispatch(getGroupList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);
  const showDrawer = (groupId) => {
    setOpen(true);
    dispatch(startEditingGroup(groupId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingGroup());
  };

  // Xử lý xóa nhóm, reload danh sách, thông báo
  const handleDeleteGroup = async (groupId) => {
    try {
      await dispatch(deleteGroup(groupId)).unwrap();
      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };
      await dispatch(getGroupList(filters));
      // Hiển thị thông báo thành công
      message.success('Xóa nhóm hạng mục thành công');
    } catch (error) {
      message.error('Xóa nhóm hạng mục thất bại. Vui lòng thử lại!');
    }
  };

  const handleEditGroup = (groupId) => {
    showDrawer(groupId);
  };

  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      // searchTerm đã được cập nhật qua onChange
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa nhóm hạng mục',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa nhóm hạng mục này?</p>
          <p>
            <strong>Mã nhóm:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên nhóm:</strong> {record?.name}
          </p>
          <p style={{ color: '#ff4d4f' }}>Lưu ý: Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteGroup(record?.id),
      width: 500,
    });
  };
  const columns = [
    {
      title: 'Mã nhóm',
      dataIndex: 'code',
      key: 'code',
      width: '30%',
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: 'Hạng mục',
      dataIndex: 'hang_muc_name',
      key: 'hang_muc_name',
      width: '30%',
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },

    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Sửa nhóm hạng mục" onClick={() => handleEditGroup(record?.id)}>
            <EditOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>{' '}
          <WrapperIcons title="Xóa nhóm hạng mục" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="delete-icon" style={{ color: '#ff4d4f' }} />
          </WrapperIcons>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách nhóm hạng mục</Title>
        <Typography.Text type="secondary">Quản lý thông tin nhóm hạng mục trong hệ thống</Typography.Text>
      </PageHeader>{' '}
      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm nhóm theo mã hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => dispatch(getGroupList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm nhóm hạng mục
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
              dataSource={groupList}
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
                showTotal: (total) => `Tổng số ${total} nhóm hạng mục`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingGroup?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditGroupForm open={open} onClose={onClose} />}
    </>
  );
}

// Styled components cho UI đồng bộ với Category.jsx
const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SubTitle = styled.div`
  color: #888;
  font-size: 16px;
  margin-bottom: 0;
`;

const SearchContainer = styled.div`
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
      background-color: #e6f7ff !important;
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

const WrapperIcons = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f5ff;
  }

  .action-icon {
    color: #1890ff;
    font-size: 18px;
    transition: all 0.3s;
    &:hover {
      color: #1677ff;
      transform: scale(1.1);
    }
  }
  .delete-icon {
    color: #ff4d4f;
    font-size: 18px;
    &:hover {
      color: #ff7875;
      transform: scale(1.1);
    }
  }
`;
