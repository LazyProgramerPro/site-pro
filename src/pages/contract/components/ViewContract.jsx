import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";

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

export default function ViewContract(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contract.loading);

  const selectedContract = useSelector(
    (state) => state.contract.editingContract
  );
  console.log("editingContract:", selectedContract);
  const dispatch = useAppDispatch();

  const items = [
    {
      label: "Product",
      children: "Cloud Database",
    },
    {
      label: "Billing",
      children: "Prepaid",
    },
    {
      label: "Time",
      children: "18:00:00",
    },
    {
      label: "Amount",
      children: "$80.00",
    },
    {
      label: "Discount",
      span: { xl: 2, xxl: 2 },
      children: "$20.00",
    },
    {
      label: "Official",
      span: { xl: 2, xxl: 2 },
      children: "$60.00",
    },
    {
      label: "Config Info",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
        </>
      ),
    },
    {
      label: "Hardware Info",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          CPU: 6 Core 3.5 GHz
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
        </>
      ),
    },
  ];

  useEffect(() => {
    setInitialValues(selectedContract || initialState);
  }, [selectedContract]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết hợp đồng ${initialValues && initialValues?.name}`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContract) && isEmpty(initialValues) ? (
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
