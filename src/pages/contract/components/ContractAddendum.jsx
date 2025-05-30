import { useStyle } from '@/hooks/useStyle';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, message, Modal, Space, Table, Tag, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';

import {
  cancelEditingContractAddendum,
  deleteContractAddendum,
  getContractAddendumList,
  startEditingContractAddendum,
} from '../redux/contractAddendum.slide';
import AddEditContractAddendumForm from './AddEditContractAddendumForm';
import ImportExcel from './ImportExcel';
import ViewContractAddendum from './ViewContractAddendum';

const { Title } = Typography;

export default function ContractAddendum(props) {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openImportExcel, setOpenImportExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contractAddendumList = useSelector((state) => state.contractAddendum.contractAddendumList);
  const loading = useSelector((state) => state.contractAddendum.loading);
  const totalCount = useSelector((state) => state.contractAddendum.totalCount);
  const editingContractAddendum = useSelector((state) => state.contractAddendum.editingContractAddendum);

  console.log('contractAddendumList:', contractAddendumList);

  const { selectedContract } = props;

  // Phân trang
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
      du_an_id: selectedContract?.du_an_id,
      cong_trinh_id: selectedContract?.cong_trinh_id,
      hop_dong_id: selectedContract?.id,
    };

    console.log('filters', filters);

    const promise = dispatch(getContractAddendumList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size, selectedContract?.id]);

  const showDrawer = (contractAddendumId) => {
    setOpen(true);
    if (contractAddendumId) {
      dispatch(startEditingContractAddendum(contractAddendumId));
    }
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingContractAddendum());
  };

  const handleDeleteContractAddendum = async (contractAddendumId) => {
    try {
      await dispatch(deleteContractAddendum(contractAddendumId)).unwrap();
      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
        du_an_id: selectedContract?.du_an_id,
        cong_trinh_id: selectedContract?.cong_trinh_id,
        hop_dong_id: selectedContract?.id,
      };
      await dispatch(getContractAddendumList(filters));
      message.success('Xóa phụ lục hợp đồng thành công');
    } catch (error) {
      message.error('Xóa phụ lục hợp đồng thất bại. Vui lòng thử lại!');
    }
  };

  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      dispatch(
        getContractAddendumList({
          searchText: searchTerm,
          pageNo: 0,
          pageSize: size,
          du_an_id: selectedContract?.du_an_id,
          cong_trinh_id: selectedContract?.cong_trinh_id,
          hop_dong_id: selectedContract?.id,
        }),
      );
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
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

  const handleSearch = () => {
    setPage(1);
    dispatch(
      getContractAddendumList({
        searchText: searchTerm,
        pageNo: 0,
        pageSize: size,
      }),
    );
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa phụ lục hợp đồng',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa phụ lục hợp đồng này?</p>
          <p>
            <strong>Mã phụ lục:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên phụ lục:</strong> {record?.name}
          </p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteContractAddendum(record?.id),
      width: 500,
    });
  };
  const columns = [
    {
      title: 'Mã phụ lục',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên phụ lục',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Tên dự án',
      dataIndex: 'du_an_name',
      key: 'du_an_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Công trình',
      dataIndex: 'cong_trinh_name',
      key: 'cong_trinh_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Hợp đồng',
      dataIndex: 'hop_dong_name',
      key: 'hop_dong_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Hạng mục',
      dataIndex: 'hang_muc_name',
      key: 'hang_muc_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Nhóm hạng mục',
      dataIndex: 'nhom_hang_muc_name',
      key: 'nhom_hang_muc_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'don_vi',
      key: 'don_vi',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'khoi_luong',
      key: 'khoi_luong',
      width: 120,
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN').format(value || 0),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'don_gia',
      key: 'don_gia',
      width: 140,
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanh_tien',
      key: 'thanh_tien',
      width: 140,
      align: 'right',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0),
    },
    {
      title: 'Nhà thầu thi công',
      dataIndex: 'nha_thau_thi_cong_name',
      key: 'nha_thau_thi_cong_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Tư vấn giám sát',
      dataIndex: 'tu_van_giam_sat_name',
      key: 'tu_van_giam_sat_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Tư vấn thiết kế',
      dataIndex: 'tu_van_thiet_ke_name',
      key: 'tu_van_thiet_ke_name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator_name',
      key: 'creator_name',
      width: 120,
      ellipsis: true,
      render: (text) => (
        <Tag color="blue" className="company-tag">
          {text || 'Chưa xác định'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 140,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <WrapperIcons title="Xem chi tiết phụ lục" onClick={() => handleViewContractAddendum(record?.id)}>
            <EyeOutlined className="action-icon" style={{ color: '#52c41a' }} />
          </WrapperIcons>
          <WrapperIcons title="Sửa phụ lục" onClick={() => handleEditContractAddendum(record?.id)}>
            <EditOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>
          <WrapperIcons title="Xóa phụ lục" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="delete-icon" style={{ color: '#ff4d4f' }} />
          </WrapperIcons>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Card>
        <SearchContainer>
          <Col span={18}>
            <FilterGroup>
              <SearchInput
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Tìm kiếm phụ lục theo mã hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                allowClear
              />
              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </FilterGroup>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => handleOpenImportExcel(null)}>
                Import Excel
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer(null)}>
                Thêm phụ lục
              </Button>
            </Space>
          </Col>
        </SearchContainer>

        {loading ? (
          <Fragment>
            <SkeletonTable />
          </Fragment>
        ) : (
          <TableContainer>
            <Table
              className={styles.customTable}
              columns={columns}
              dataSource={contractAddendumList}
              pagination={{
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  onShowSizeChange(current, size);
                },
                hideOnSinglePage: false,
                current: page,
                total: totalCount || contractAddendumList?.length,
                pageSize: size,
                onChange: (value) => {
                  setPage(value);
                },
                showTotal: (total) => `Tổng số ${total} phụ lục hợp đồng`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingContractAddendum?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
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

// Styled components cho UI đồng bộ với Contract
const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled(Input)`
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
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
