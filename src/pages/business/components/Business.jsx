import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingBusiness, deleteBusiness, getBusinessList, startEditingBusiness } from '../redux/business.slice';
import AddEditBusinessForm from './AddEditBusinessForm';

export default function Business() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const businessList = useSelector((state) => state.business.businessList);
  const loading = useSelector((state) => state.business.loading);

  const editingBusiness = useSelector((state) => state.business.editingBusiness);
  console.log('editingBusiness1:', editingBusiness);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getBusinessList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (businessId) => {
    setOpen(true);
    dispatch(startEditingBusiness(businessId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingBusiness());
  };

  const handleDeleteBusiness = (businessId) => {
    dispatch(deleteBusiness(businessId));
  };

  const handleEditBusiness = (businessId) => {
    showDrawer(businessId);
  };

  const columns = [
    {
      title: 'Mã doanh nghiệp',
      dataIndex: 'businessCode',
      key: 'businessCode',
      width: '45%',
      fixed: 'left',
    },

    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'businessName',
      key: 'businessName',
      width: '45%',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Sửa thông tin doanh nghiệp" onClick={() => handleEditBusiness(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa doanh nghiệp">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa doanh nghiệp này?"
              onConfirm={() => handleDeleteBusiness(record?.id)}
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
      <PageTitle>Doanh nghiệp</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Tìm doanh nghiệp ..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => dispatch(getBusinessList(searchTerm))}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
            Thêm doanh nghiệp
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
              dataSource={businessList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingBusiness?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditBusinessForm open={open} onClose={onClose} />}
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
