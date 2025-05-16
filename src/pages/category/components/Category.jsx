import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Popconfirm, Space, Table, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingCategory, deleteCategory, getCategoryList, startEditingCategory } from '../redux/category.slice';
import AddEditCategoryForm from './AddEditCategoryForm';

const { Title } = Typography;

export default function Category() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const categoryList = useSelector((state) => state.category.categoryList);
  const totalCount = useSelector((state) => state.category.totalCount);
  const loading = useSelector((state) => state.category.loading);
  const editingCategory = useSelector((state) => state.category.editingCategory);

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
    const promise = dispatch(getCategoryList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);

  const showDrawer = (categoryId) => {
    setOpen(true);
    dispatch(startEditingCategory(categoryId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingCategory());
  };
  // Xử lý xóa hạng mục, reload danh sách, thông báo
  const handleDeleteCategory = async (categoryId) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };
      await dispatch(getCategoryList(filters));
      // Hiển thị thông báo thành công
      message.success('Xóa hạng mục thành công');
    } catch (error) {
      message.error('Xóa hạng mục thất bại. Vui lòng thử lại!');
    }
  };
  const handleEditCategory = (categoryId) => {
    showDrawer(categoryId);
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
  const columns = [
    {
      title: 'Mã hạng mục',
      dataIndex: 'code',
      key: 'code',
      width: '30%',
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên hạng mục',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: 'Tên công trình',
      dataIndex: 'cong_trinh_name',
      key: 'cong_trinh_name',
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
          {' '}
          <WrapperIcons title="Sửa hạng mục" onClick={() => handleEditCategory(record?.id)}>
            <EditOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>
          <WrapperIcons title="Xóa hạng mục">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa hạng mục này?"
              onConfirm={() => handleDeleteCategory(record?.id)}
            >
              <DeleteOutlined className="delete-icon" style={{ color: '#ff4d4f' }} />
            </Popconfirm>
          </WrapperIcons>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách hạng mục công trình</Title>
        <Typography.Text type="secondary">Quản lý thông tin hạng mục công trình trong hệ thống</Typography.Text>
      </PageHeader>{' '}
      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm hạng mục theo mã hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => dispatch(getCategoryList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm hạng mục
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
              dataSource={categoryList}
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
                showTotal: (total) => `Tổng số ${total} hạng mục`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingCategory?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditCategoryForm open={open} onClose={onClose} />}
    </>
  );
}

// Styled components cho UI đồng bộ với Construction.jsx
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
