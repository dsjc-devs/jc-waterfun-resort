import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import LogoSection from './logo';


const SuccessPage = ({ heading, message }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)',
      }}
    >
      <Stack
        spacing={4}
        alignItems='center'
        sx={{
          bgcolor: 'white',
          px: 6,
          py: 6,
          borderRadius: 4,
          boxShadow: 3,
          maxWidth: 400,
        }}
      >
        <Box>
          <LogoSection />
        </Box>
        <Typography variant="h2" color="success.main" fontWeight={700} gutterBottom>
          SUCCESS!
        </Typography>
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {heading}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>
        <Box className='btn-section' display='flex' flexDirection='row' gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 2, fontWeight: 600, px: 4 }}
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SuccessPage;
