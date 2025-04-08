import { Descriptions, Tag } from "antd";

export default function OverviewConstructionDiary(props) {
  const { selectedConstructionDiary } = props;
  
  const items = [
    {
      key: '1',
      label: "Mã nhật ký",
      children: selectedConstructionDiary?.diaryCode || "N/A",
    },
    {
      key: '2',
      label: "Tên nhật ký",
      children: selectedConstructionDiary?.name || "N/A",
    },
    {
      key: '3',
      label: "Tên dự án",
      children: selectedConstructionDiary?.projectName || "N/A",
    },
    {
      key: '4',
      label: "Công trình",
      children: selectedConstructionDiary?.construction || "N/A",
    },
    {
      key: '5',
      label: "Loại nhật ký",
      children: selectedConstructionDiary?.type || "N/A",
    },
    {
      key: '6',
      label: "Ngày tạo",
      children: selectedConstructionDiary?.createdAt || "N/A",
    },
    {
      key: '7',
      label: "Trạng thái",
      children: selectedConstructionDiary?.status ? (
        <Tag color={
          selectedConstructionDiary.status === 'Đã duyệt' ? 'green' : 
          selectedConstructionDiary.status === 'Mới tạo' ? 'orange' : 'red'
        }>
          {selectedConstructionDiary.status}
        </Tag>
      ) : "N/A",
    },
    {
      key: '8',
      label: "Người tạo",
      children: selectedConstructionDiary?.authorName || "N/A",
    },
    {
      key: '9',
      label: "Chức vụ",
      children: selectedConstructionDiary?.authorPosition || "N/A",
    },
    {
      key: '10',
      label: "Người phê duyệt",
      children: selectedConstructionDiary?.approvedBy || "Chưa phê duyệt",
    },
    {
      key: '11',
      label: "Ngày phê duyệt",
      children: selectedConstructionDiary?.approvalDate || "Chưa phê duyệt",
    },
    {
      key: '12',
      label: "Nội dung nhật ký",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedConstructionDiary?.content || "N/A",
    },
    {
      key: '13',
      label: "Điều kiện thời tiết",
      children: `${selectedConstructionDiary?.weather || "N/A"}, ${selectedConstructionDiary?.temperature || "N/A"}`,
    },
    {
      key: '14',
      label: "Nhân lực",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedConstructionDiary?.workforce ? (
        <>
          <div>Kỹ sư: {selectedConstructionDiary.workforce.engineers} người</div>
          <div>Công nhân: {selectedConstructionDiary.workforce.workers} người</div>
          <div>Giám sát: {selectedConstructionDiary.workforce.supervisors} người</div>
        </>
      ) : "N/A",
    },
    {
      key: '15',
      label: "Thiết bị sử dụng",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedConstructionDiary?.equipment ? 
            selectedConstructionDiary.equipment.map((item, index) => (
              <div key={index}>- {item}</div>
            )) 
            : "Không có thiết bị"
          }
        </>
      ),
    },
    {
      key: '16',
      label: "Vật liệu sử dụng",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedConstructionDiary?.materials ? 
            selectedConstructionDiary.materials.map((item, index) => (
              <div key={index}>- {item}</div>
            )) 
            : "Không có vật liệu"
          }
        </>
      ),
    },
    {
      key: '17',
      label: "Công việc đã thực hiện",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedConstructionDiary?.activities ? 
            selectedConstructionDiary.activities.map((activity, index) => (
              <div key={index}>- {activity}</div>
            )) 
            : "Không có hoạt động"
          }
        </>
      ),
    },
    {
      key: '18',
      label: "Vấn đề phát sinh",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedConstructionDiary?.issues && selectedConstructionDiary.issues.length > 0 ? 
            selectedConstructionDiary.issues.map((issue, index) => (
              <div key={index}>- {issue}</div>
            )) 
            : "Không có vấn đề phát sinh"
          }
        </>
      ),
    },
    {
      key: '19',
      label: "Ghi chú",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: selectedConstructionDiary?.notes || "Không có ghi chú",
    },
    {
      key: '20',
      label: "Hình ảnh",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          {selectedConstructionDiary?.images && selectedConstructionDiary.images.length > 0 ? 
            selectedConstructionDiary.images.map((image, index) => (
              <div key={index}>- {image}</div>
            )) 
            : "Không có hình ảnh"
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