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
      key: '1',
      label: "Mã hợp đồng",
      children: selectedContract?.contractCode || "N/A",
    },
    {
      key: '2',
      label: "Tên hợp đồng",
      children: selectedContract?.contractName || "N/A",
    },
    {
      key: '3',
      label: "Tên dự án",
      children: selectedContract?.projectName || "N/A",
    },
    {
      key: '4',
      label: "Công trình",
      children: selectedContract?.construction || "N/A",
    },
    {
      key: '5',
      label: "Bên A",
      children: "Công ty CP Đầu tư và Phát triển XYZ",
    },
    {
      key: '6',
      label: "Bên B",
      children: selectedContract?.partyB || "N/A",
    },
    {
      key: '7',
      label: "Ngày ký",
      children: "15/06/2023",
    },
    {
      key: '8',
      label: "Ngày hiệu lực",
      children: "01/07/2023",
    },
    {
      key: '9',
      label: "Ngày kết thúc",
      children: "31/12/2024",
    },
    {
      key: '10',
      label: "Giá trị hợp đồng",
      children: "25.500.000.000 VNĐ",
    },
    {
      key: '11',
      label: "Đã thanh toán",
      children: "12.750.000.000 VNĐ (50%)",
    },
    {
      key: '12',
      label: "Còn lại",
      children: "12.750.000.000 VNĐ (50%)",
    },
    {
      key: '13',
      label: "Hình thức thanh toán",
      children: "Chuyển khoản theo tiến độ",
    },
    {
      key: '14',
      label: "Trạng thái",
      children: "Đang thực hiện",
    },
    {
      key: '15',
      label: "Điều khoản thanh toán",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Tạm ứng: 30% giá trị hợp đồng</div>
          <div>Thanh toán đợt 1: 30% sau khi hoàn thành 50% khối lượng</div>
          <div>Thanh toán đợt 2: 30% sau khi hoàn thành và nghiệm thu</div>
          <div>Thanh toán đợt 3: 10% sau khi hết thời gian bảo hành</div>
        </>
      ),
    },
    {
      key: '16',
      label: "Phạm vi công việc",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- Thiết kế và thi công phần móng</div>
          <div>- Xây dựng phần thô</div>
          <div>- Lắp đặt hệ thống cơ điện</div>
          <div>- Hoàn thiện mặt ngoài</div>
        </>
      ),
    },
    {
      key: '17',
      label: "Thời gian bảo hành",
      children: "24 tháng kể từ ngày nghiệm thu",
    },
    {
      key: '18',
      label: "Tiến độ thực hiện",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- Khởi công: 05/07/2023</div>
          <div>- Hoàn thành phần móng: 15/10/2023</div>
          <div>- Hoàn thành phần thô: 30/06/2024</div>
          <div>- Nghiệm thu bàn giao: 15/12/2024</div>
        </>
      ),
    },
    {
      key: '19',
      label: "Tài liệu đính kèm",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- Hợp đồng gốc</div>
          <div>- Phụ lục 01: Tiến độ thực hiện chi tiết</div>
          <div>- Phụ lục 02: Điều khoản thanh toán</div>
          <div>- Bản vẽ thiết kế</div>
        </>
      ),
    },
    {
      key: '20',
      label: "Đại diện bên A",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Ông Nguyễn Văn A</div>
          <div>Chức vụ: Tổng Giám đốc</div>
          <div>SĐT: 0912.345.678</div>
          <div>Email: nguyenvana@xyz.com</div>
        </>
      ),
    },
    {
      key: '21',
      label: "Đại diện bên B",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>Ông Trần Văn B</div>
          <div>Chức vụ: Giám đốc</div>
          <div>SĐT: 0987.654.321</div>
          <div>Email: tranvanb@company.com</div>
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
      title={`Chi tiết hợp đồng ${initialValues && initialValues?.contractName}`}
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
