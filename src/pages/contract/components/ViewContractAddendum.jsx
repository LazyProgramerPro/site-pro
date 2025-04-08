import {
  Descriptions,
  Drawer,
  Form,
  Spin
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";

const initialState = {

};

export default function ViewContractAddendum(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contractAddendum.loading);

  const selectedContractAddendum = useSelector(
    (state) => state.contractAddendum.editingContractAddendum
  );
  console.log("editingContractAddendum:", selectedContractAddendum);
  const dispatch = useAppDispatch();

  const items = [
    {
      key: '1',
      label: "Mã phụ lục",
      children: selectedContractAddendum?.code || "N/A",
    },
    {
      key: '2',
      label: "Tên phụ lục",
      children: selectedContractAddendum?.name || "N/A",
    },
    {
      key: '3',
      label: "Dự án",
      children: selectedContractAddendum?.project || "N/A",
    },
    {
      key: '4',
      label: "Hạng mục",
      children: selectedContractAddendum?.category || "N/A",
    },
    {
      key: '5',
      label: "Hợp đồng gốc",
      children: selectedContractAddendum?.contract || "N/A",
    },
    {
      key: '6',
      label: "Nhà thầu thi công",
      children: selectedContractAddendum?.contractor || "N/A",
    },
    {
      key: '7',
      label: "Tư vấn giám sát",
      children: selectedContractAddendum?.supervisor || "N/A",
    },
    {
      key: '8',
      label: "Tư vấn thiết kế",
      children: selectedContractAddendum?.designer || "N/A",
    },
    {
      key: '9',
      label: "Ngày ký phụ lục",
      children: selectedContractAddendum?.signDate || "N/A",
    },
    {
      key: '10',
      label: "Ngày có hiệu lực",
      children: selectedContractAddendum?.effectiveDate || "N/A",
    },
    {
      key: '11',
      label: "Giá trị phụ lục",
      children: selectedContractAddendum?.amount || "N/A",
    },
    {
      key: '12',
      label: "Nội dung phụ lục",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedContractAddendum?.content || "N/A",
    },
    {
      key: '13',
      label: "Lý do điều chỉnh",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedContractAddendum?.reason || "N/A",
    },
    {
      key: '14',
      label: "Tác động đến tiến độ",
      children: "Kéo dài thêm 15 ngày làm việc",
    },
    {
      key: '15',
      label: "Tác động đến ngân sách",
      children: "Tăng 8.5% so với hợp đồng ban đầu",
    },
    {
      key: '16',
      label: "Phê duyệt bởi",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- Chủ đầu tư: Ông Nguyễn Văn A - 20/12/2023</div>
          <div>- Tư vấn giám sát: Ông Lê Minh B - 18/12/2023</div>
          <div>- Nhà thầu: Ông Trần Thanh C - 15/12/2023</div>
        </>
      ),
    },
    {
      key: '17',
      label: "Tài liệu đính kèm",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- Biên bản thỏa thuận điều chỉnh</div>
          <div>- Bản vẽ thiết kế điều chỉnh</div>
          <div>- Bảng dự toán chi phí bổ sung</div>
          <div>- Biên bản họp kỹ thuật</div>
        </>
      ),
    },
  ];

  useEffect(() => {
    setInitialValues(selectedContractAddendum || initialState);
  }, [selectedContractAddendum]);

  return (
    <Drawer
      width={1000}
      title={`Chi tiết phụ lục hợp đồng ${
        initialValues && initialValues?.code
      }`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContractAddendum) && isEmpty(initialValues) ? (
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
