const errorCodeDefs = {
  '-10': 'Lỗi không xác định',
  0: 'Thành công',
  '-1': 'Không thành công',
  2: 'Không tìm thấy user',
  3: 'Mật khẩu không đúng',
  4: 'Không tìm thấy mã tài liệu',

  5: 'Email is not registered',
  6: 'Email is primary account',
  7: 'Email is secondary account',
  8: 'FIELD REQUIRED must not be empty',

  9: 'User không có quyền thực hiện chức năng này',
  10: 'Username đã tồn tại',
  11: 'Email đã tồn tại',
  12: 'Số điện thoại đã tồn tại',

  13: 'User không tồn tại',
  14: 'Role không tồn tại',
  15: 'Người dùng không có Role',

  17: 'UserName không để trống',
  18: 'Username bị trùng',
  19: 'Nhân viên không tồn tại',

  20: 'Đối tượng đã tồn tại',

  30: 'File không thể trống',
  31: 'File không upload',
  32: 'Item không tồn tại',

  104: 'Token timedout',
  105: 'Server error',
  106: 'Invalid token',
  107: 'Invalid token',
  108: 'Invalid token',
  109: 'Invalid token',

  200: 'Database error',
};

function getErrorMessage(code) {
  return errorCodeDefs.hasOwnProperty(code) ? errorCodeDefs[code] : 'Lỗi không xác định';
}

export default getErrorMessage;
