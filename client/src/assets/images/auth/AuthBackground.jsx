import Box from '@mui/material/Box';
import { useGetResortDetails } from 'api/resort-details';
import logo from 'assets/images/logo/logo-main.png'

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const { resortDetails } = useGetResortDetails()

  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <img
        src={resortDetails?.companyInfo?.logo || logo}
        alt="John Jezan Waterfun Resort & Event Hall Logo"
        style={{
          width: '100%',
          height: 'calc(100vh - 175px)',
          objectFit: 'contain',
          opacity: 0.7
        }}
      />
    </Box>
  );
}
