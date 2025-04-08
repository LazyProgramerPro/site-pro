import { useStyle } from "@/hooks/useStyle";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Input, Popconfirm, Space, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SkeletonTable } from "../../../components/table/SkeletonTable";
import { useAppDispatch } from "../../../redux/store";
import {
  cancelEditingProject,
  deleteProject,
  getProjectList,
  startEditingProject,
} from "../redux/project.slice";
import AddEditProjectForm from "./AddEditProjectForm";
import ViewProject from "./ViewProject";

export default function Project() {
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);

  const projectList = useSelector((state) => state.project.projectList);
  const loading = useSelector((state) => state.project.loading);

  const editingProject = useSelector((state) => state.project.editingProject);
  console.log("editingProject1:", editingProject);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(getProjectList());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  const showDrawer = (projectId) => {
    setOpen(true);
    dispatch(startEditingProject(projectId));
  };

  const onClose = () => {
    setOpen(false);
    dispatch(cancelEditingProject());
  };

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProject(projectId));
  };

  const handleEditProject = (projectId) => {
    showDrawer(projectId);
  };

  const handleViewProject = (projectId) => {
    setOpenDetail(true);
    dispatch(startEditingProject(projectId));
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    dispatch(cancelEditingProject());
  };

  const columns = [
    {
      title: "Mã dự án",
      dataIndex: "projectCode",
      key: "projectCode",
      width: "10%",
      fixed: "left",
    },
    {
      title: "Tên dự án",
      dataIndex: "projectName",
      key: "projectName",
      width: "10%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "10%",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: "10%",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: "10%",
    },
    {
      title: "Nhà thầu thi công",
      dataIndex: "contractor",
      key: "contractor",
      width: "10%",
    },
    {
      title: "Tư vấn giám sát",
      dataIndex: "supervisor",
      key: "supervisor",
      width: "10%",
    },
    {
      title: "Tư vấn thiết kế",
      dataIndex: "designer",
      key: "designer",
      width: "10%",
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <WrapperIcons title="Xem chi tiết dự án" onClick={() => handleViewProject(record?.id)}>
            <EyeOutlined />
          </WrapperIcons>

          <WrapperIcons title="Sửa dự án" onClick={() => handleEditProject(record?.id)}>
            <EditOutlined />
          </WrapperIcons>

          <WrapperIcons title="Xóa dự án">
            <Popconfirm
              cancelText="Hủy bỏ"
              okText="Xóa"
              title="Bạn có chắc chắn muốn xóa dự án này?"
              onConfirm={() => handleDeleteProject(record?.id)}
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
      <PageTitle>Danh sách dự án</PageTitle>
      <Card
        title={
          <>
            <SearchInput placeholder="Search..." />
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {}}>
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
            Thêm dự án
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
              dataSource={projectList}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20],
              }}
              scroll={{ x: "max-content", y: 450 }}
              size="middle"
              rowClassName={(record) =>
                editingProject?.id === record.id ? "active-row" : ""
              }
            />
          </TableContainer>
        )}
      </Card>
      {open && <AddEditProjectForm open={open} onClose={onClose} />}
      {openDetail && (
        <ViewProject open={openDetail} onClose={handleCloseDetail} />
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
