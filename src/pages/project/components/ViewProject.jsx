import {
  Descriptions,
  Drawer,
  Spin
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const initialState = {

};


export default function ViewProject(props) {
  const { onClose, open } = props;
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.project.loading);

  const selectedProject = useSelector((state) => state.project.editingProject);
  console.log("editingProject:", selectedProject);

  const items = [
    {
      key: '1',
      label: "Mã dự án",
      children: selectedProject?.projectCode || "N/A",
    },
    {
      key: '2',
      label: "Tên dự án",
      children: selectedProject?.projectName || "N/A",
    },
    {
      key: '3',
      label: "Địa chỉ",
      children: selectedProject?.address || "N/A",
    },
    {
      key: '4',
      label: "Mô tả",
      children: selectedProject?.description || "N/A",
    },
    {
      key: '5',
      label: "Ngày bắt đầu",
      children: selectedProject?.startDate || "N/A",
    },
    {
      key: '6',
      label: "Ngày kết thúc",
      children: selectedProject?.endDate || "N/A",
    },
    {
      key: '7',
      label: "Nhà thầu thi công",
      children: selectedProject?.contractor || "N/A",
    },
    {
      key: '8',
      label: "Tư vấn giám sát",
      children: selectedProject?.supervisor || "N/A",
    },
    {
      key: '9',
      label: "Tư vấn thiết kế",
      children: selectedProject?.designer || "N/A",
    },
    {
      key: '10',
      label: "Trạng thái",
      children: selectedProject?.status || "Đang thực hiện",
    },
    {
      key: '11',
      label: "Tiến độ",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Hoàn thành: 35%</div>
          <div>Dự kiến: Đúng tiến độ</div>
        </>
      ),
    },
    {
      key: '12',
      label: "Ngân sách",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Tổng ngân sách: 15.5 tỷ VND</div>
          <div>Đã giải ngân: 6.2 tỷ VND</div>
        </>
      ),
    },
    {
      key: '13',
      label: "Tài liệu",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Hợp đồng thi công</div>
          <div>Bản vẽ thiết kế</div>
          <div>Báo cáo hàng tháng</div>
        </>
      ),
    },
    {
      key: '14',
      label: "Thành viên dự án",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Nguyễn Văn A - Giám đốc dự án</div>
          <div>Trần Thị B - Kỹ sư xây dựng</div>
          <div>Lê Văn C - Giám sát công trình</div>
        </>
      ),
    },
  ];

  useEffect(() => {
    setInitialValues(selectedProject || initialState);
  }, [selectedProject]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết dự án ${initialValues && initialValues?.projectCode}`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedProject) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          items={items}
        />
      )}
    </Drawer>
  );
}
