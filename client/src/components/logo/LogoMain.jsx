import logo from 'src/assets/images/logo/logo-circular.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => (
  <img src={logo} alt="Logo" style={{ height: '90px', width: '100%', objectFit: 'cover', paddingBlock: 20 }} />
)

export default Logo;
