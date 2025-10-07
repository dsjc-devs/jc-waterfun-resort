// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import { useGetMenuMaster } from 'api/menu';

// assets
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //
export default function NavCard() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3, p: drawerOpen ? 2 : 1, minWidth: 0 }}>
      {drawerOpen ? (
        <Stack alignItems="center" spacing={2.5}>
          <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
          <Stack alignItems="center">
            <Typography variant="h5">Need Help?</Typography>
            <Typography variant="h6" color="secondary">
              Get to resolve query
            </Typography>
          </Stack>
          <AnimateButton>
            <Button component={Link} target="_blank" href="/portal/tickets/submit" variant="contained" color="primary" size="small">
              Submit a ticket
            </Button>
          </AnimateButton>
        </Stack>
      ) : (
        <Stack alignItems="center" spacing={1}>
          <CardMedia component="img" image={avatar} sx={{ width: 36, height: 36 }} />
          <AnimateButton>
            <Button component={Link} target="_blank" href="/portal/tickets/submit" variant="contained" color="primary" size="small" sx={{ minWidth: 0, px: 1 }}>
              ?
            </Button>
          </AnimateButton>
        </Stack>
      )}
    </MainCard>
  );
}
