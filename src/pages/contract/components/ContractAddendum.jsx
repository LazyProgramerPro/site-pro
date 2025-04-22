import { useStyle } from '@/hooks/useStyle';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popconfirm, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';

import AddEditContractAddendumForm from './AddEditContractAddendumForm';
import ViewContractAddendum from './ViewContractAddendum';
import {
  cancelEditingContractAddendum,
  deleteContractAddendum,
  getContractAddendumList,
  startEditingContractAddendum,
} from '../redux/contractAddendum.slide';
import ImportExcel from './ImportExcel';

export default function ContractAddendum() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openImportExcel, setOpenImportExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contractAddendumList = useSelector((state) => state.contractAddendum.contractAddendumList);
  const loading = useSelector((state) => state.contractAddendum.loading);

  const editingContractAddendum = useSelector((state) => state.contractAddendum.editingContractAddendum);

  // TODO: check xem contact nào đang được chọn
  console.log('editingContractAddendum:', editingContractAddendum);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getContractAddendumList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (contractAddendumId) => {
    setOpen(true);
    dispatch(startEditingContractAddendum(contractAddendumId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingContractAddendum());
  };

  const handleDeleteContractAddendum = (contractAddendumId) => {
    dispatch(deleteContractAddendum(contractAddendumId));
  };

  const handleEditContractAddendum = (contractAddendumId) => {
    showDrawer(contractAddendumId);
  };

  const handleViewContractAddendum = (contractAddendumId) => {
    setOpenDetail(true);
    dispatch(startEditingContractAddendum(contractAddendumId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingContractAddendum());
  };
  const handleOpenImportExcel = (contractAddendumId) => {
    setOpenImportExcel(true);
    dispatch(startEditingContractAddendum(contractAddendumId));
  };

  const handleCloseImportExcel = () => {
    setOpenImportExcel(false);
    dispatch(cancelEditingContractAddendum());
  };

  const columns = [
    {
      title: 'Mã phụ lục',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      fixed: 'left',
    },
    {
      title: 'Tên phụ lục',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Dự án',
      dataIndex: 'project',
      key: 'project',
      width: '10%',
    },
    {
      title: 'Hạng mục',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
    },
    {
      title: 'Hợp đồng',
      dataIndex: 'contract',
      key: 'contract',
      width: '10%',
    },
    {
      title: 'Nhà thầu thi công',
      dataIndex: 'contractor',
      key: 'contractor',
      width: '10%',
    },
    {
      title: 'Tư vấn giám sát',
      dataIndex: 'supervisor',
      key: 'supervisor',
      width: '10%',
    },
    {
      title: 'Tư vấn thiết kế',
      dataIndex: 'designer',
      key: 'designer',
      width: '10%',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Xem chi tiết phụ lục" onClick={() => handleViewContractAddendum(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>

          <WrapperIcons title="Sửa phụ lục" onClick={() => handleEditContractAddendum(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa phụ lục">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa phụ lục hợp đồng này?"
              onConfirm={() => handleDeleteContractAddendum(record?.id)}
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
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => dispatch(getContractAddendumList(searchTerm))}
            >
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <>
            <Button
              style={{ marginRight: 10 }}
              type="dashed"
              onClick={() => handleOpenImportExcel(null)}
              icon={<PlusOutlined />}
            >
              Import Excel
            </Button>

            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm phụ lục
            </Button>
          </>
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
              dataSource={contractAddendumList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: 'max-content', y: 800 }}
              size="middle"
              rowClassName={(record) => (editingContractAddendum?.id === record.id ? 'active-row' : '')}
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditContractAddendumForm open={open} onClose={onClose} />}
      {openDetail && <ViewContractAddendum open={openDetail} onClose={handleCloseDetail} />}
      {openImportExcel && <ImportExcel open={openImportExcel} onClose={handleCloseImportExcel} />}
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
