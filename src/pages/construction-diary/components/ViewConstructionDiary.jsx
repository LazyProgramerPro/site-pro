import { Drawer, Form, Spin, Tabs } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import AppraisalConstructionDiary from "./AppraisalConstructionDiary";
import OverviewConstructionDiary from "./OverviewConstructionDiary";

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

export default function ViewConstructionDiary(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.constructionDiary.loading);

  const selectedConstructionDiary = useSelector(
    (state) => state.constructionDiary.editingConstructionDiary
  );
  console.log("editingConstructionDiary:", selectedConstructionDiary);
  const dispatch = useAppDispatch();

  const items = [
    {
      key: "1",
      label: "Tổng quan nhật ký xây dựng",
      children: (
        <OverviewConstructionDiary
          selectedConstructionDiary={selectedConstructionDiary}
        />
      ),
    },

    {
      key: "2",
      label: "Thành phần liên quan",
      children: "Thành phần liên quan",
    },
    {
      key: "3",
      label: "Biên bản ",
      children: "Biên bản ",
    },
    {
      key: "4",
      label: "Lịch sử",
      children: "Lịch sử",
    },
    {
      key: "5",
      label: "Thẩm định",
      children: <AppraisalConstructionDiary />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    setInitialValues(selectedConstructionDiary || initialState);
  }, [selectedConstructionDiary]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết nhật ký xây dựng ${
        initialValues && initialValues?.name
      }`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedConstructionDiary) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      )}
    </Drawer>
  );
}
