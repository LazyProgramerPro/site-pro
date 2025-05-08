# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Checklist

- Sửa lại tên dataIndex của các cột trong bảng
- Thêm fake data vào bảng
- Make bảng scrollable
- Thêm icon search vào ô tìm kiếm
- Active row
- Thêm title cho các icon trong bảng và chọn đúng item
- Các role hoặc các trạng thái cần được để active
- Sửa lại name và message cho các row trong form
- Responsive cho các cột trong bảng

### Login chưa trả kèm về thông tin của user

```json
{
  "id": "string",
  "username": "string",
  "phone_number": "string",
  "full_name": "string",
  "email": "string",
  "last_login": "2025-05-08T16:07:53.740Z",
  "avatar_url": "string",
  "companies": [
    "companyId1",
    "companyId2",
    "companyId3"
  ], // companyId1, companyId2, companyId3 là id DOANH NGHIỆP, 1 user có thể thuộc nhiều doanh nghiệp
  "positions": [
    {
      "companyId": "companyId1",
      "positionName": "Giám đốc"
    },
    {
      "companyId": "companyId2",
      "positionName": "Trưởng phòng"
    },
    {
      "companyId": "companyId3",
      "positionName": "Nhân viên"
    }
    
  ], 
  // trong mỗi 1 doanh nghiệp, user có thể có nhiều vị trí khác nhau => tự điền flex data
  // mỗi doanh nghiệp chỉ có thể add data 1 lần
  "roles": [
    "ADMIN",
    "TVTK",
    "NTTC"
  ]
  // 1 user có thể có nhiều vai trò khác nhau trong HỆ THỐNG, hệ thống bao gồm 5 ROLE : Admin, CHủ đầu tư, Nhà thầu thi công, TVGS, TVTK
}
```
