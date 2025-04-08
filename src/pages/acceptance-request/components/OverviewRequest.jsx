import { Descriptions } from "antd";

export default function OverviewRequest(props) {
  const { selectedAcceptanceRequest } = props;
  
  const items = [
    {
      key: '1',
      label: "Mã yêu cầu",
      children: selectedAcceptanceRequest?.code || "N/A",
    },
    {
      key: '2',
      label: "Tên yêu cầu",
      children: selectedAcceptanceRequest?.name || "N/A",
    },
    {
      key: '3',
      label: "Dự án",
      children: selectedAcceptanceRequest?.project || "N/A",
    },
    {
      key: '4',
      label: "Phụ lục hợp đồng",
      children: selectedAcceptanceRequest?.contractAppendix || "N/A",
    },
    {
      key: '5',
      label: "Ngày tạo",
      children: selectedAcceptanceRequest?.createdAt || "N/A",
    },
    {
      key: '6',
      label: "Trạng thái",
      children: selectedAcceptanceRequest?.status || "N/A",
    },
    {
      key: '7',
      label: "Ngày hoàn thành",
      children: selectedAcceptanceRequest?.completionDate || "N/A",
    },
    {
      key: '8',
      label: "Đơn vị yêu cầu",
      children: selectedAcceptanceRequest?.requestedBy || "N/A",
    },
    {
      key: '9',
      label: "Người phê duyệt",
      children: selectedAcceptanceRequest?.approvedBy || "Chưa phê duyệt",
    },
    {
      key: '10',
      label: "Ngày phê duyệt",
      children: selectedAcceptanceRequest?.approvalDate || "Chưa phê duyệt",
    },
    {
      key: '11',
      label: "Mô tả chi tiết",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedAcceptanceRequest?.description || "N/A",
    },
    {
      key: '12',
      label: "Tỷ lệ hoàn thành",
      children: selectedAcceptanceRequest?.completionPercent || "N/A",
    },
    {
      key: '13',
      label: "Giá trị thanh toán",
      children: selectedAcceptanceRequest?.paymentAmount || "N/A",
    },
    {
      key: '14',
      label: "Ngày kiểm tra",
      children: selectedAcceptanceRequest?.inspectionDate || "Chưa kiểm tra",
    },
    {
      key: '15',
      label: "Nhận xét",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedAcceptanceRequest?.observations || "Chưa có nhận xét",
    },
    {
      key: '16',
      label: "Tài liệu kèm theo",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedAcceptanceRequest?.supportingDocuments ? 
            selectedAcceptanceRequest.supportingDocuments.map((doc, index) => (
              <div key={index}>- {doc}</div>
            )) 
            : "Không có tài liệu kèm theo"
          }
        </>
      ),
    },
    {
      key: '17',
      label: "Thành viên đoàn nghiệm thu",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedAcceptanceRequest?.teamMembers ? 
            selectedAcceptanceRequest.teamMembers.map((member, index) => (
              <div key={index}>- {member}</div>
            )) 
            : "Chưa chỉ định thành viên"
          }
        </>
      ),
    },
  ];
  
  return (
    <div>
      <Descriptions
        bordered
        column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        items={items}
      />
    </div>
  );
}