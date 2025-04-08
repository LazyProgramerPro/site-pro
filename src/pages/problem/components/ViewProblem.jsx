import { Drawer, Form, Spin, Tabs } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import AppraisalProblem from "./AppraisalProblem";
import OverviewProblem from "./OverviewProblem";
import CancelProblem from "./CancelProblem";

const initialState = {

};



export default function ViewProblem(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.problem.loading);

  const selectedProblem = useSelector((state) => state.problem.editingProblem);
  console.log("editingProblem:", selectedProblem);
  const dispatch = useAppDispatch();

  const items = [
    {
      key: "1",
      label: "Tổng quan vấn đề",
      children: <OverviewProblem selectedProblem={selectedProblem} />,
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
      children: <AppraisalProblem />,
    },

    {
      key: "6",
      label: "Hủy bỏ",
      children: <CancelProblem />,
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    setInitialValues(selectedProblem || initialState);
  }, [selectedProblem]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết vấn đề ${initialValues && initialValues?.code}`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedProblem) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      )}
    </Drawer>
  );
}
