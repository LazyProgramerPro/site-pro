/**
 * Định dạng ngày từ chuỗi ngày sang định dạng dd-mm-yyyy
 * @param {string} dateString - Chuỗi ngày cần định dạng
 * @returns {string} Chuỗi ngày đã định dạng hoặc chuỗi trống nếu đầu vào không hợp lệ
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Lấy ngày, tháng, năm và định dạng với số 0 đứng trước nếu cần
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    
    // Trả về định dạng dd-mm-yyyy
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Lỗi khi định dạng ngày:', error);
    return '';
  }
};
