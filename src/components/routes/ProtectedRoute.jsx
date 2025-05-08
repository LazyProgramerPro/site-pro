import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  useEffect(
    function () {
      if (!user) navigate('/login');
    },
    [user, navigate],
  );

  if (user && user?.token) {
    // If authenticated, render the protected component
    return <>{children}</>;
  }
};

export default ProtectedRoute;
