import React from 'react';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  Box,
  Stack,
  Typography,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material';
import PageTitle from 'components/PageTitle';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const toggle = (setter) => () => setter((prev) => !prev);
  const preventMouseDown = (e) => e.preventDefault();

  return (
    <React.Fragment>
      <PageTitle title='Change Password' />
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setTimeout(() => {
            toast.success('You’ve successfully changed your password');
            resetForm();
            setSubmitting(false);
          }, 300);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} padding={4}>
              <Grid item xs={12} md={3}>
                <MainCard>
                  <Stack spacing={1} alignItems='center'>
                    <Typography variant='h4'>Security</Typography>
                    <Typography variant='body2' color='text.secondary' textAlign='center'>
                      Update your account password. Make sure your new password is strong and unique.
                    </Typography>
                  </Stack>
                </MainCard>
              </Grid>
              <Grid item xs={12} md={9}>
                <MainCard>
                  <Typography variant='h3' gutterBottom>Change Password</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                      <Box mb={1}>
                        <InputLabel sx={{ mb: 1 }}>Current Password</InputLabel>
                        <OutlinedInput
                          fullWidth
                          type={showCurrent ? 'text' : 'password'}
                          name='currentPassword'
                          value={values.currentPassword}
                          onChange={handleChange}
                          placeholder='Current Password'
                          error={touched.currentPassword && Boolean(errors.currentPassword)}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle current password visibility'
                                onClick={toggle(setShowCurrent)}
                                onMouseDown={preventMouseDown}
                                edge='end'
                                color='secondary'
                              >
                                {showCurrent ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <Box mb={1}>
                        <InputLabel sx={{ mb: 1 }}>New Password</InputLabel>
                        <OutlinedInput
                          fullWidth
                          type={showNew ? 'text' : 'password'}
                          name='newPassword'
                          value={values.newPassword}
                          onChange={handleChange}
                          placeholder='New Password'
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle new password visibility'
                                onClick={toggle(setShowNew)}
                                onMouseDown={preventMouseDown}
                                edge='end'
                                color='secondary'
                              >
                                {showNew ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6}>
                      <Box mb={1}>
                        <InputLabel sx={{ mb: 1 }}>Confirm New Password</InputLabel>
                        <OutlinedInput
                          fullWidth
                          type={showConfirm ? 'text' : 'password'}
                          name='confirmPassword'
                          value={values.confirmPassword}
                          onChange={handleChange}
                          placeholder='Confirm New Password'
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle confirm password visibility'
                                onClick={toggle(setShowConfirm)}
                                onMouseDown={preventMouseDown}
                                edge='end'
                                color='secondary'
                              >
                                {showConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Stack direction='row' justifyContent='flex-end' mt={4}>
                    <AnimateButton>
                      <LoadingButton
                        loading={isSubmitting}
                        disableElevation
                        disabled={isSubmitting}
                        loadingPosition='start'
                        fullWidth
                        variant='contained'
                        color='primary'
                        style={{ width: '200px' }}
                        type='submit'
                      >
                        Update Password
                      </LoadingButton>
                    </AnimateButton>
                  </Stack>
                </MainCard>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default ChangePassword;