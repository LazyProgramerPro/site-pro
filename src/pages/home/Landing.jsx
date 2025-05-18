import { Link } from 'react-router-dom';
import main from '../../assets/images/main.svg';
import Wrapper from '../../assets/wrappers/LandingPage';
import Logo from '../../components/logo/Logo';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            <span>Quản lý</span> dự án chuyên nghiệp
          </h1>
          <p>
            Giải pháp toàn diện giúp tối ưu hóa quy trình làm việc của bạn. Theo dõi tiến độ dự án, phân công nhiệm vụ
            và cộng tác hiệu quả trong một nền tảng thống nhất. Nâng cao năng suất và đảm bảo dự án của bạn luôn đúng
            tiến độ.
          </p>

          <Link to="/login" className="btn btn-hero">
            Đăng nhập ngay
          </Link>
        </div>
        <img src={main} alt="project management" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
