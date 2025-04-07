import { useStyle } from "@/hooks/useStyle";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Input, Popconfirm, Space, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SkeletonTable } from "../../../components/table/SkeletonTable";
import { useAppDispatch } from "../../../redux/store";
import {
  cancelEditingAcceptanceRequest,
  deleteAcceptanceRequest,
  getAcceptanceRequestList,
  startEditingAcceptanceRequest,
} from "../redux/acceptanceRequest.slice";
import ViewAcceptanceRequest from "./ViewAcceptanceRequest";

export default function AcceptanceRequest() {
  const { styles } = useStyle();

  const [openDetail, setOpenDetail] = useState(false);

  const acceptanceRequestList = useSelector(
    (state) => state.acceptanceRequest.acceptanceRequestList
  );
  const loading = useSelector((state) => state.acceptanceRequest.loading);

  const editingAcceptanceRequest = useSelector(
    (state) => state.acceptanceRequest.editingAcceptanceRequest
  );
  console.log("editingAcceptanceRequest1:", editingAcceptanceRequest);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getAcceptanceRequestList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const handleViewAcceptanceRequest = (acceptanceRequestId) => {
    setOpenDetail(true);
    dispatch(startEditingAcceptanceRequest(acceptanceRequestId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingAcceptanceRequest());
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "name",
      key: "name",
      width: "10%",
      fixed: "left",
    },
    {
      title: "Tên yêu cầu",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Dự án",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Phụ lục hợp đồng",
      dataIndex: "description",
      key: "description",
      width: "10%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "price",
      key: "price",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "category",
      key: "category",
      width: "10%",
    },

    {
      title: "Hành động",
      key: "action",
      width: "10%",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <WrapperIcons onClick={() => handleViewAcceptanceRequest(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageTitle>Danh sách yêu cầu nghiệm thu</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." />
            <Button type="primary" onClick={() => {}}>
              Tìm kiếm
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
              dataSource={acceptanceRequestList}
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

      {openDetail && (
        <ViewAcceptanceRequest open={openDetail} onClose={handleCloseDetail} />
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
