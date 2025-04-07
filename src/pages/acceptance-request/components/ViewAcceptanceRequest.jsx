import { Drawer, Form, Spin, Tabs } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import OverviewRequest from "./OverviewRequest";
import AppraisalRequest from "./AppraisalRequest";

const initialState = {
  userName: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  email: "",
  phoneNumber: "",
  role: "",
  company: "",
  position: "",
};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function ViewAcceptanceRequest(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.acceptanceRequest.loading);

  const selectedAcceptanceRequest = useSelector(
    (state) => state.acceptanceRequest.editingAcceptanceRequest
  );
  console.log("editingAcceptanceRequest:", selectedAcceptanceRequest);
  const dispatch = useAppDispatch();

  const items = [
    {
      key: "1",
      label: "Tổng quan",
      children: (
        <OverviewRequest
          selectedAcceptanceRequest={selectedAcceptanceRequest}
        />
      ),
    },
    {
      key: "2",
      label: "Danh mục nghiệm thu",
      children: "Danh mục nghiệm thu",
    },
    {
      key: "3",
      label: "Thành phần",
      children: "Thành phần",
    },
    {
      key: "4",
      label: "Biên bản nghiệm thu",
      children: "Biên bản nghiệm thu",
    },
    {
      key: "5",
      label: "Lịch sử",
      children: "Lịch sử",
    },
    {
      key: "6",
      label: "Thẩm định",
      children: <AppraisalRequest />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    setInitialValues(selectedAcceptanceRequest || initialState);
  }, [selectedAcceptanceRequest]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết yêu cầu nghiệm thu ${
        initialValues && initialValues?.name
      }`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedAcceptanceRequest) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      )}
    </Drawer>
  );
}
