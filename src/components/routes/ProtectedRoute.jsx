import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  // Kiểm tra user và xác thực token
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // Kiểm tra nếu không có token hợp lệ hoặc đã hết hạn
    if (!isAuthenticated || !user?.token) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Nếu đã xác thực và có thông tin user, hiển thị component được bảo vệ
  if (isAuthenticated && user?.token) {
    return <>{children}</>;
  }

  // Trường hợp đang kiểm tra xác thực
  return null;
};

export default ProtectedRoute;
