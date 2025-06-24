// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Profile from './Profile';
import MobileSection from './MobileSection';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const navigate = useNavigate()

  return (
    <>
      {!downLG && <Box sx={{ width: '100%' }} />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Stack gap={3} marginInline={3} flexDirection='row' alignItems='center'>
        <Box sx={{ flexShrink: 0, mx: 1, display: 'flex', alignItems: 'center' }}>
          <Button sx={{ color: 'text.primary' }} onClick={() => navigate('/', '_blank')}> Home Website </Button>
        </Box>
      </Stack>
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
