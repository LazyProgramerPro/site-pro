import { useStyle } from '@/hooks/useStyle';
import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, message, Modal, Space, Table, Typography } from 'antd';
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

const { Title } = Typography;

export default function Construction() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const constructionList = useSelector((state) => state.construction.constructionList);
  const totalCount = useSelector((state) => state.construction.totalCount);
  const loading = useSelector((state) => state.construction.loading);
  const editingConstruction = useSelector((state) => state.construction.editingConstruction);

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
    const promise = dispatch(getConstructionList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);

  const showDrawer = (constructionId) => {
    setOpen(true);
    dispatch(startEditingConstruction(constructionId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingConstruction());
  };

  // Xử lý xóa công trình, reload danh sách, thông báo
  const handleDeleteConstruction = async (constructionId) => {
    try {
      await dispatch(deleteConstruction(constructionId)).unwrap();
      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };
      await dispatch(getConstructionList(filters));
      // Hiển thị thông báo thành công
      message.success('Xóa công trình thành công');
    } catch (error) {
      message.error('Xóa công trình thất bại. Vui lòng thử lại!');
    }
  };

  const handleEditConstruction = (constructionId) => {
    showDrawer(constructionId);
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
      title: 'Xác nhận xóa công trình',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa công trình này?</p>
          <p>
            <strong>Mã công trình:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên công trình:</strong> {record?.name}
          </p>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            Lưu ý: Việc xóa công trình sẽ xóa tất cả hạng mục và nhóm hạng mục liên quan.
          </p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteConstruction(record?.id),
      width: 500,
    });
  };

  const columns = [
    {
      title: 'Mã công trình',
      dataIndex: 'code',
      key: 'code',
      width: '30%',
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: 'Tên công trình',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text, record) => (
        <Space>
          <BankOutlined style={{ color: '#1890ff' }} />
          <Typography.Text>{text}</Typography.Text>
        </Space>
      ),
    },

    {
      title: 'Tên dự án',
      dataIndex: 'du_an_name',
      key: 'du_an_name',
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
          <WrapperIcons title="Sửa công trình" onClick={() => handleEditConstruction(record?.id)}>
            <EditOutlined className="action-icon" style={{ color: '#1890ff' }} />
          </WrapperIcons>{' '}
          <WrapperIcons title="Xóa công trình" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="delete-icon" style={{ color: '#ff4d4f' }} />
          </WrapperIcons>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách công trình</Title>
        <Typography.Text type="secondary">Quản lý thông tin công trình trong hệ thống</Typography.Text>
      </PageHeader>
      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm công trình theo mã hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() =>
                dispatch(getConstructionList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))
              }
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm công trình
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
              dataSource={constructionList}
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
                showTotal: (total) => `Tổng số ${total} công trình`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingConstruction?.id === record?.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditConstructionForm open={open} onClose={onClose} />}
    </>
  );
}

// Styled components cho UI đồng bộ với Business.jsx/Project.jsx
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
