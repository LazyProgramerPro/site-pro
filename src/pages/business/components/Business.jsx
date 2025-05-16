import { SkeletonTable } from '@/components/table/SkeletonTable';
import { useStyle } from '@/hooks/useStyle';
import { useAppDispatch } from '@/redux/store';
import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Modal, Row, Space, Table, Tag, Typography, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { cancelEditingBusiness, deleteBusiness, getBusinessList, startEditingBusiness } from '../redux/business.slice';
import AddEditBusinessForm from './AddEditBusinessForm';

const { Title } = Typography;

export default function Business() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const businessList = useSelector((state) => state.business.businessList);
  const totalCount = useSelector((state) => state.business.totalCount);
  const loading = useSelector((state) => state.business.loading);

  const editingBusiness = useSelector((state) => state.business.editingBusiness);

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

    const promise = dispatch(getBusinessList(filters));
    return () => {
      promise.abort();
    };
  }, [dispatch, page, size]);

  const showDrawer = (businessId) => {
    setOpen(true);
    dispatch(startEditingBusiness(businessId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingBusiness());
  };
  // Hàm xóa doanh nghiệp, nên dùng .unwrap() để bắt lỗi chuẩn Redux Toolkit
  const handleDeleteBusiness = async (businessId) => {
    try {
      await dispatch(deleteBusiness(businessId)).unwrap();

      const filters = {
        pageNo: page - 1,
        pageSize: size,
        searchText: searchTerm,
      };

      await dispatch(getBusinessList(filters));
      message.success('Xóa doanh nghiệp thành công');
    } catch (error) {
      console.error('Lỗi khi xóa doanh nghiệp:', error);
      message.error('Xóa doanh nghiệp thất bại. Vui lòng thử lại!');
    }
  };

  const handleEditBusiness = (businessId) => {
    showDrawer(businessId);
  };
  // Xử lý search khi nhấn Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      dispatch(getBusinessList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }));
    }
  };
  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa doanh nghiệp',
      icon: <QuestionCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa doanh nghiệp này?</p>
          <p>
            <strong>Mã doanh nghiệp:</strong> {record?.code}
          </p>
          <p>
            <strong>Tên doanh nghiệp:</strong> {record?.name}
          </p>
          <p style={{ color: '#ff4d4f' }}>Lưu ý: Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
        </div>
      ),
      okText: 'Xóa',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Hủy bỏ',
      onOk: () => handleDeleteBusiness(record?.id),
      width: 500,
    });
  };
  const columns = [
    {
      title: 'Mã doanh nghiệp',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      fixed: 'left',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },

    {
      title: 'Tên doanh nghiệp',
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
      title: 'Lãnh đạo của doanh nghiệp',
      dataIndex: 'leader_name',
      key: 'leader_name',
      width: '30%',
      render: (text, record) => {
        if (!record?.leaders?.length) return <Typography.Text type="secondary">Chưa có thông tin</Typography.Text>;
        return (
          <TagsContainer>
            {record?.leaders?.map((item, index) => (
              <Tag key={index} color="blue" className="leader-tag">
                {item?.full_name}
              </Tag>
            ))}
          </TagsContainer>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <Space size="middle">
          <ActionButton title="Sửa thông tin doanh nghiệp" onClick={() => handleEditBusiness(record?.id)}>
            <EditOutlined className="action-icon" />
          </ActionButton>{' '}
          <ActionButton title="Xóa doanh nghiệp" onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined className="action-icon delete-icon" />
          </ActionButton>
        </Space>
      ),
    },
  ];
  return (
    <>
      <PageHeader>
        <Title level={2}>Danh sách doanh nghiệp</Title>
        <Typography.Text type="secondary">Quản lý thông tin doanh nghiệp trong hệ thống</Typography.Text>
      </PageHeader>

      <Card>
        <SearchContainer>
          <Col span={18}>
            <SearchInput
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Tìm kiếm doanh nghiệp theo mã hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              allowClear
            />
            <Button
              type="primary"
              onClick={() => dispatch(getBusinessList({ searchText: searchTerm, pageNo: page - 1, pageSize: size }))}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => showDrawer(null)} icon={<PlusOutlined />}>
              Thêm doanh nghiệp
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
              dataSource={businessList}
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
                showTotal: (total) => `Tổng số ${total} doanh nghiệp`,
              }}
              scroll={{ x: 'max-content', y: 450 }}
              size="middle"
              rowClassName={(record) => (editingBusiness?.id === record.id ? 'active-row' : '')}
              rowKey="id"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditBusinessForm open={open} onClose={onClose} />}
    </>
  );
}

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

  .leader-tag {
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

  .delete-icon {
    color: #ff4d4f;

    &:hover {
      color: #ff7875;
    }
  }
`;
