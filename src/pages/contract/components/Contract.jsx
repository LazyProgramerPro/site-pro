import { useStyle } from "@/hooks/useStyle";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Popconfirm, Select, Space, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SkeletonTable } from "../../../components/table/SkeletonTable";
import { useAppDispatch } from "../../../redux/store";
import {
  cancelEditingContract,
  deleteContract,
  getContractList,
  startEditingContract,
} from "../redux/contract.slice";
import AddEditContractForm from "./AddEditContractForm";
import ContractAddendumDrawer from "./ContractAddendumDrawer";
import ViewContract from "./ViewContract";

export default function Contract() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openContractAddendum, setOpenContractAddendum] = useState(false);

  const contractList = useSelector((state) => state.contract.contractList);
  const loading = useSelector((state) => state.contract.loading);

  const editingContract = useSelector(
    (state) => state.contract.editingContract
  );
  console.log("editingContract1:", editingContract);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getContractList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (contractId) => {
    setOpen(true);
    dispatch(startEditingContract(contractId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingContract());
  };

  const handleDeleteContract = (contractId) => {
    dispatch(deleteContract(contractId));
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

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "name",
      key: "name",
      width: "10%",
      fixed: "left",
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Tên dự án",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: "Công trình",
      dataIndex: "price",
      key: "price",
      width: "20%",
    },
    {
      title: "Bên B",
      dataIndex: "category",
      key: "category",
      width: "20%",
    },

    {
      title: "Hành động",
      key: "action",
      width: "10%",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <WrapperIcons onClick={() => handleViewContract(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>
          <WrapperIcons onClick={() => handleEditContract(record?.id)}>
            <EditOutlined />
          </WrapperIcons>
          <WrapperIcons onClick={() => handleViewContractAddendum(record?.id)}>
            <ReconciliationOutlined />
          </WrapperIcons>

          <WrapperIcons>
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa hợp đồng này?"
              onConfirm={() => handleDeleteContract(record?.id)}
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
      <PageTitle>Danh sách hợp đồng</PageTitle>
      <Card
        title={
          <>
            <Select
              style={{ width: 200, marginRight: 10 }}
              defaultValue="all"
              placeholder="Tên dự án"
            >
              <Select.Option value="all">Tất cả</Select.Option>
              <Select.Option value="active">Đang hoạt động</Select.Option>
            </Select>
            <SearchInput placeholder="Search..." />
            <Button type="primary" onClick={() => {}}>
              Tìm kiếm
            </Button>
          </>
        }
        extra={
          <Button
            type="primary"
            onClick={() => showDrawer(null)}
            icon={<PlusOutlined />}
          >
            Thêm
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
              dataSource={contractList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: "max-content" }}
              size="middle"
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditContractForm open={open} onClose={onClose} />}
      {openDetail && (
        <ViewContract open={openDetail} onClose={handleCloseDetail} />
      )}
      {openContractAddendum && (
        <ContractAddendumDrawer
          open={openContractAddendum}
          onClose={handleCloseContractAddendum}
        />
      )}
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
`;

const WrapperIcons = styled.div`
  cursor: pointer;
`;
