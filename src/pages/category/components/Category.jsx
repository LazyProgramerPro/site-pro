import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingCategory, deleteCategory, getCategoryList, startEditingCategory } from '../redux/category.slice';
import AddEditCategoryForm from './AddEditCategoryForm';

export default function Category() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const categoryList = useSelector((state) => state.category.categoryList);
  const loading = useSelector((state) => state.category.loading);

  const editingCategory = useSelector((state) => state.category.editingCategory);
  console.log('editingCategory1:', editingCategory);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getCategoryList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (categoryId) => {
    setOpen(true);
    dispatch(startEditingCategory(categoryId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingCategory());
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  const handleEditCategory = (categoryId) => {
    showDrawer(categoryId);
  };

  const columns = [
    {
      title: 'Mã hạng mục',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: '30%',
      fixed: 'left',
    },
    {
      title: 'Tên hạng mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '30%',
    },
    {
      title: 'Tên công trình',
      dataIndex: 'constructionName',
      key: 'constructionName',
      width: '30%',
    },

    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Sửả hạng mục" onClick={() => handleEditCategory(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa hạng mục">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa hạng mục này?"
              onConfirm={() => handleDeleteCategory(record?.id)}
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
      <PageTitle>Hạng mục</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => dispatch(getCategoryList(searchTerm))}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm hạng mục
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
              dataSource={categoryList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingCategory?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditCategoryForm open={open} onClose={onClose} />}
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
