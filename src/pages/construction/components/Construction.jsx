import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import {
  cancelEditingConstruction,
  deleteConstruction,
  getConstructionList,
  startEditingConstruction,
} from '../redux/construction.slice';
import AddEditConstructionForm from './AddEditConstructionForm';

export default function Construction() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const constructionList = useSelector((state) => state.construction.constructionList);
  const loading = useSelector((state) => state.construction.loading);

  const editingConstruction = useSelector((state) => state.construction.editingConstruction);
  console.log('editingConstruction1:', editingConstruction);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getConstructionList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (constructionId) => {
    setOpen(true);
    dispatch(startEditingConstruction(constructionId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingConstruction());
  };

  const handleDeleteConstruction = (constructionId) => {
    dispatch(deleteConstruction(constructionId));
  };

  const handleEditConstruction = (constructionId) => {
    showDrawer(constructionId);
  };

  const columns = [
    {
      title: 'Mã công trình',
      dataIndex: 'code',
      key: 'code',
      width: '30%',
      fixed: 'left',
    },
    {
      title: 'Tên công trình',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Tên dự án',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '30%',
    },

    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Sửa công trình" onClick={() => handleEditConstruction(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa công trình">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa công trình này?"
              onConfirm={() => handleDeleteConstruction(record?.id)}
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
      <PageTitle>Công trình</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => dispatch(getConstructionList(searchTerm))}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm công trình
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
              dataSource={constructionList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingConstruction?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditConstructionForm open={open} onClose={onClose} />}
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
