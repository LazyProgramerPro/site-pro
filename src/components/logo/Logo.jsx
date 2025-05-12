import logo from '../../assets/images/logo.png';

const Logo = () => {
  return (
    <img
      src={logo}
      alt="jobify"
      className="logo"
      style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
    />
  );
};

export default Logo;
