import { useStyle } from '@/hooks/useStyle';
import { getConstructionList } from '@/pages/construction/redux/construction.slice';
import { getProjectList } from '@/pages/project/redux/project.slice';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReconciliationOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, message, Modal, Select, Space, Table, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SkeletonTable } from '../../../components/table/SkeletonTable';
import { useAppDispatch } from '../../../redux/store';
import { cancelEditingContract, deleteContract, getContractList, startEditingContract } from '../redux/contract.slice';
import AddEditContractForm from './AddEditContractForm';
import ContractAddendumDrawer from './ContractAddendumDrawer';
import ViewContract from './ViewContract';

const { Title } = Typography;

export default function Contract() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openContractAddendum, setOpenContractAddendum] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [selectedConstructionId, setSelectedConstructionId] = useState('all');
  const contractList = useSelector((state) => state.contract.contractList);
  const loading = useSelector((state) => state.contract.loading);
  const editingContract = useSelector((state) => state.contract.editingContract);
  const totalCount = useSelector((state) => state.contract.totalCount);
  const projectList = useSelector((state) => state.project.projectList);
  const constructionList = useSelector((state) => state.construction.constructionList);

  // Phân trang
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const dispatch = useAppDispatch();

  // Lấy danh sách list dự án và công trình từ Redux

  useEffect(() => {
    const filters = {
      pageNo: 0,
      pageSize: 10000, // Lấy tất cả để lọc
      searchText: '',
    };
    const promise = dispatch(getProjectList(filters));
    const promiseGetConstructionList = dispatch(getConstructionList(filters));
    return () => {
      promise.abort();
    };
  }, []);

  useEffect(() => {
    const filters = {
      pageNo: 0,
      pageSize: 10000, // Lấy tất cả để lọc
      searchText: '',
      du_an_id: selectedProjectId === 'all' ? null : selectedProjectId,
    };
    const promise = dispatch(getConstructionList(filters));
    return () => {
      promise.abort();
    };
  }, [selectedProjectId]);

  useEffect(() => {
    const filters = {
      pageNo: page - 1,
      pageSize: size,
      searchText: searchTerm,
      du_an_id: selectedProjectId === 'all' ? null : selectedProjectId,
      cong_trinh_id: selectedConstructionId === 'all' ? null : selectedConstructionId,
    };

    const promise = dispatch(getContractList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size, selectedConstructionId, selectedProjectId]);

  const showDrawer = (contractId) => {
    setOpen(true);
    if (contractId) {
      dispatch(startEditingContract(contractId));
    }
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingContract());
  };
  const handleDeleteContract = async (contractId) => {
    try {
      await dispatch(deleteContract(contractId)).unwrap();
      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
        du_an_id: selectedProjectId === 'all' ? null : selectedProjectId,
        cong_trinh_id: selectedConstructionId === 'all' ? null : selectedConstructionId,
      };
      await dispatch(getContractList(filters));
      message.success('Xóa hợp đồng thành công');
    } catch (error) {
      message.error('Xóa hợp đồng thất bại. Vui lòng thử lại!');
    }
  };

  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      dispatch(
        getContractList({
          searchText: searchTerm,
          pageNo: 0,
          pageSize: size,
          du_an_id: selectedProjectId === 'all' ? null : selectedProjectId,
          cong_trinh_id: selectedConstructionId === 'all' ? null : selectedConstructionId,
        }),
      );
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  const handleEditContract = (contractId) => {
    showDrawer(contractId);
  };

  const handleViewContract = (contractId) => {
    setOpenDetail(true);
    dispatch(startEditingContract(contractId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingContract());
  };

  const handleViewContractAddendum = (contractId) => {
    setOpenContractAddendum(true);
    dispatch(startEditingContract(contractId));
  };

  const handleCloseContractAddendum = () => {
    setOpenContractAddendum(false);
    dispatch(cancelEditingContract());
  };
  const handleSearch = () => {
    setPage(1);
    dispatch(
      getContractList({
        searchText: searchTerm,
        pageNo: 0,
        pageSize: size,
        du_an_id: selectedProjectId === 'all' ? null : selectedProjectId,
        cong_trinh_id: selectedConstructionId === 'all' ? null : selectedConstructionId,
      }),
    );
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa hợp đồng',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa hợp đồng này?</p>
          <p>
            <strong>Mã hợp đồng:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên hợp đồng:</strong> {record?.name}
          </p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteContract(record?.id),
      width: 500,
    });
  };

  const columns = [
    {
      title: 'Mã hợp đồng',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên hợp đồng',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Bên A',
      dataIndex: 'ben_a_name',
      key: 'ben_a_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Bên B',
      dataIndex: 'ben_b_name',
      key: 'ben_b_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator_name',
      key: 'creator_name',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <WrapperIcons title="Xem chi tiết hợp đồng" onClick={() => handleViewContract(record?.id)}>
            <EyeOutlined className="action-icon" style={{ color: '#52c41a' }} />
          </WrapperIcons>
          <WrapperIcons title="Sửa hợp đồng" onClick={() => handleEditContract(record?.id)}>
            <EditOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>
          <WrapperIcons title="Xem danh sách phụ lục hợp đồng" onClick={() => handleViewContractAddendum(record?.id)}>
            <ReconciliationOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>
          <WrapperIcons title="Xóa hợp đồng" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="delete-icon" style={{ color: '#ff4d4f' }} />
          </WrapperIcons>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <Title level={2}>Quản lý hợp đồng</Title>
        <Typography.Text type="secondary">Quản lý thông tin hợp đồng trong hệ thống</Typography.Text>
      </PageHeader>

      <Card>
        <SearchContainer>
          <Col span={18}>
            <FilterGroup>
              <FilterSelect
                value={selectedProjectId}
                onChange={setSelectedProjectId}
                placeholder="Chọn dự án"
                allowClear
              >
                <Select.Option value="all">Tất cả dự án</Select.Option>
                {projectList.map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    {project.name}
                  </Select.Option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={selectedConstructionId}
                onChange={setSelectedConstructionId}
                placeholder="Chọn công trình"
                allowClear
              >
                <Select.Option value="all">Tất cả công trình</Select.Option>
                {constructionList.map((construction) => (
                  <Select.Option key={construction.id} value={construction.id}>
                    {construction.name}
                  </Select.Option>
                ))}
              </FilterSelect>

              <SearchInput
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Tìm kiếm hợp đồng theo mã hoặc tên..."
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showDrawer(null)}>
              Thêm hợp đồng
            </Button>
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
              dataSource={contractList}
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
                showTotal: (total) => `Tổng số ${total} hợp đồng`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingContract?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>

      {open && <AddEditContractForm open={open} onClose={onClose} />}
      {openDetail && <ViewContract open={openDetail} onClose={handleCloseDetail} />}
      {openContractAddendum && (
        <ContractAddendumDrawer open={openContractAddendum} onClose={handleCloseContractAddendum} />
      )}
    </>
  );
}

// Styled components cho UI đồng bộ với Group và Category
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

const FilterSelect = styled(Select)`
  min-width: 180px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
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

const CodeText = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: #1890ff;
`;
