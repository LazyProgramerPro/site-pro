import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * LoginRoute kiểm tra nếu người dùng đã đăng nhập thì sẽ chuyển hướng đến trang dashboard
 * Nếu chưa đăng nhập, sẽ hiển thị trang Login
 */
const LoginRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  // Nếu đã đăng nhập (có thông tin user và token), chuyển hướng đến dashboard
  if (user && user?.token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị form đăng nhập
  return <>{children}</>;
};

export default LoginRoute;
