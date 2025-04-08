import { useStyle } from "@/hooks/useStyle";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Table, Tag } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SkeletonTable } from "../../../components/table/SkeletonTable";
import { useAppDispatch } from "../../../redux/store";
import {
  cancelEditingAcceptanceRequest,
  getAcceptanceRequestList,
  startEditingAcceptanceRequest
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
      dataIndex: "code",
      key: "code",
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
      dataIndex: "project",
      key: "project",
      width: "10%",
    },
    {
      title: "Phụ lục hợp đồng",
      dataIndex: "contractAppendix",
      key: "contractAppendix",
      width: "10%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",

      //render tag status
      render: (status) => {
        let color = "green";
        if (status === "Đã duyệt") {
          color = "orange";
        } else if (status === "Đang xem xét") {
          color = "red";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },

    {
      title: "Hành động",
      key: "action",
      width: "10%",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Xem chi tiết yêu cầu nghiệm thu" onClick={() => handleViewAcceptanceRequest(record?.id)}>
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
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {}}>
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
              scroll={{ x: "max-content", y: 450 }}
              size="middle"
              rowClassName={(record) =>
                editingAcceptanceRequest?.id === record.id ? "active-row" : ""
              }
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
