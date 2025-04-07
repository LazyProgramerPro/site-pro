import { Link } from "react-router-dom";
import main from "../../assets/images/main.svg";
import Wrapper from "../../assets/wrappers/LandingPage";
import Logo from "../../components/logo/Logo";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Project <span>management</span> app
          </h1>
          <p>
            Ứng dụng theo dõi công việc giúp bạn quản lý và theo dõi các công
            việc của mình một cách hiệu quả. Từ việc tạo danh sách công việc đến
            theo dõi tiến độ, ứng dụng này sẽ giúp bạn tổ chức và tối ưu hóa quy
            trình làm việc của mình.
          </p>

          <Link to="/login" className="btn ">
            Login
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
