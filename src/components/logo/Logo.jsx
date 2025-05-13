import logo from '../../assets/images/logo.png';

const Logo = ({ style }) => {
  return (
    <img
      src={logo}
      alt="Site Pro Logo"
      className="logo"
      style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', ...style }}
    />
  );
};

export default Logo;
