import { Descriptions, Tag } from "antd";

export default function OverviewProblem(props) {
  const { selectedProblem } = props;
  
  const items = [
    {
      key: '1',
      label: "Mã vấn đề",
      children: selectedProblem?.code || "N/A",
    },
    {
      key: '2',
      label: "Tên vấn đề",
      children: selectedProblem?.name || "N/A",
    },
    {
      key: '3',
      label: "Loại vấn đề",
      children: selectedProblem?.type || "N/A",
    },
    {
      key: '4',
      label: "Dự án",
      children: selectedProblem?.project || "N/A",
    },
    {
      key: '5',
      label: "Phụ lục hợp đồng",
      children: selectedProblem?.contractAppendix || "N/A",
    },
    {
      key: '6',
      label: "Người tạo",
      children: selectedProblem?.creator || "N/A",
    },
    {
      key: '7',
      label: "Thời gian tạo",
      children: selectedProblem?.createdAt || "N/A",
    },
    {
      key: '8',
      label: "Trạng thái",
      children: selectedProblem?.status ? (
        <Tag color={
          selectedProblem.status === 'Đã giải quyết' || selectedProblem.status === 'Đã đóng' ? 'green' : 
          selectedProblem.status === 'Đang xử lý' ? 'orange' :
          selectedProblem.status === 'Chờ phản hồi' ? 'blue' : 
          selectedProblem.status === 'Tạm hoãn' ? 'purple' : 'red'
        }>
          {selectedProblem.status}
        </Tag>
      ) : "N/A",
    },
    {
      key: '9',
      label: "Mức độ ưu tiên",
      children: selectedProblem?.priority ? (
        <Tag color={
          selectedProblem.priority === 'Cao' ? 'red' : 
          selectedProblem.priority === 'Trung bình' ? 'orange' : 'green'
        }>
          {selectedProblem.priority}
        </Tag>
      ) : "N/A",
    },
    {
      key: '10',
      label: "Mô tả chi tiết",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedProblem?.description || "N/A",
    },
    {
      key: '11',
      label: "Tác động",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedProblem?.impact || "N/A",
    },
    {
      key: '12',
      label: "Người được giao xử lý",
      children: selectedProblem?.assignedTo || "Chưa phân công",
    },
    {
      key: '13',
      label: "Ngày báo cáo",
      children: selectedProblem?.reportedDate || "N/A",
    },
    {
      key: '14',
      label: "Hạn xử lý",
      children: selectedProblem?.dueDate || "N/A",
    },
    {
      key: '15',
      label: "Giải pháp",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedProblem?.solution || "Chưa có giải pháp",
    },
    {
      key: '16',
      label: "Tài liệu đính kèm",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedProblem?.attachments ? 
            selectedProblem.attachments.map((doc, index) => (
              <div key={index}>- {doc}</div>
            )) 
            : "Không có tài liệu đính kèm"
          }
        </>
      ),
    },
    {
      key: '17',
      label: "Lịch sử xử lý",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          <div>- {selectedProblem?.createdAt || "N/A"}: Tạo vấn đề</div>
          {selectedProblem?.status === "Đang xử lý" && (
            <div>- {selectedProblem?.createdAt || "N/A"}: Bắt đầu xử lý</div>
          )}
          {selectedProblem?.status === "Đã giải quyết" && (
            <>
              <div>- {selectedProblem?.createdAt || "N/A"}: Bắt đầu xử lý</div>
              <div>- {selectedProblem?.dueDate || "N/A"}: Hoàn thành xử lý</div>
            </>
          )}
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