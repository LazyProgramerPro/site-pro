import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * LoginRoute kiểm tra nếu người dùng đã đăng nhập thì sẽ chuyển hướng đến trang dashboard
 * Nếu chưa đăng nhập, sẽ hiển thị trang Login
 */
const LoginRoute = ({ children }) => {
  // Sử dụng isAuthenticated và user để kiểm tra trạng thái xác thực
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Nếu đã xác thực và có token, chuyển hướng đến dashboard
  if (isAuthenticated && user?.token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa đăng nhập, hiển thị form đăng nhập
  return <>{children}</>;
};

export default LoginRoute;
