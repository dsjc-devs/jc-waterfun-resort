import React from 'react';
import { Box, Grid, InputLabel, OutlinedInput, Stack, Typography, FormHelperText, Button } from '@mui/material';
import { Formik } from 'formik';
import { useGetSingleUser } from 'api/users';
import { toast } from 'react-toastify';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import MainCard from 'components/MainCard';
import PageTitle from 'components/PageTitle';
import useAuth from 'hooks/useAuth';
import agent from 'api';
import AvatarUpload from 'components/dropzone/AvatarUpload';
import * as Yup from 'yup';
import emptyUser from 'assets/images/users/empty-user.png'
import { CloseOutlined } from '@ant-design/icons';

const EditProfile = () => {
  const { user: loggedInUser } = useAuth();
  const { user, mutate } = useGetSingleUser(loggedInUser?.userId);

  const {
    firstName,
    lastName,
    emailAddress,
    avatar,
    position,
    phoneNumber,
    userId
  } = user || {};

  const fullName = `${firstName} ${lastName}`;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .max(255, 'First Name must be at most 255 characters')
      .required('First Name is required'),
    lastName: Yup.string()
      .max(255, 'Last Name must be at most 255 characters')
      .required('Last Name is required'),
    emailAddress: Yup.string()
      .email('Must be a valid email address')
      .max(255, 'Email must be at most 255 characters')
      .required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits')
      .required('Phone Number is required'),
    avatar: Yup.array()
      .min(1, 'Avatar is required')
      .nullable(),
  });

  return (
    <React.Fragment>
      <PageTitle title='Edit Profile' />
      <Formik
        enableReinitialize
        initialValues={{
          firstName,
          lastName,
          emailAddress,
          avatar: avatar || "",
          phoneNumber,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
              if (key === 'avatar' && values[key].length > 0) {
                formData.append('avatar', values[key][0]);
              } else {
                formData.append(key, values[key]);
              }
            });

            await agent.Users.editUser(userId, formData);
            await mutate();
            toast.success("Profile edited successfully.");
          } catch (error) {
            toast.error(error?.message || "Error occured.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit, isSubmitting }) => {
          const handlePhoneChange = (e) => {
            const input = e.target.value.replace(/\D/g, "");
            const numberOnly = input.startsWith("63") ? input.slice(2) : input;
            if (numberOnly.length <= 10) {
              setFieldValue("phoneNumber", numberOnly);
            }
          };

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} padding={4}>
                <Grid item xs={12} sm={12} md={3}>
                  <MainCard>
                    <Stack direction='row' justifyContent='center' alignItems='center' marginBottom={2} spacing={2}>
                      <AvatarUpload
                        file={values.avatar}
                        setFieldValue={(field, value) => setFieldValue('avatar', value)}
                        initialFile={values.avatar || ""}
                        error={touched.avatar && Boolean(errors.avatar)}
                      />
                    </Stack>
                    {touched.avatar && errors.avatar && (
                      <FormHelperText error sx={{ textAlign: 'center' }}>
                        {errors.avatar}
                      </FormHelperText>
                    )}

                    {values.avatar && values.avatar.length > 0 && (
                      <Stack direction="row" justifyContent="center" mt={1}>
                        <Button
                          color="error"
                          onClick={() => setFieldValue('avatar', "")}
                          size="small"
                          startIcon={<CloseOutlined />}
                        >
                          Clear Avatar
                        </Button>
                      </Stack>
                    )}

                    <Stack spacing={1} alignItems='center' mt={2}>
                      <Typography variant='h5'>
                        {fullName}
                      </Typography>
                      <Typography variant='subtitle2' color='secondary'>
                        {user && position?.[0]?.label}
                      </Typography>
                    </Stack>
                  </MainCard>
                </Grid>
                <Grid item xs={12} sm={12} md={9}>
                  <MainCard>
                    <Typography variant='h3' gutterBottom>Personal Information</Typography>
                    <Grid container spacing={2} marginBottom={1}>
                      <Grid item xs={12} sm={12} md={6}>
                        <Box marginBottom={1}>
                          <InputLabel htmlFor="personal-first-name" sx={{ mb: 1 }}>First Name</InputLabel>
                          <OutlinedInput
                            onChange={handleChange}
                            fullWidth
                            name='firstName'
                            value={values.firstName || ''}
                            placeholder="First Name"
                            error={touched.firstName && Boolean(errors.firstName)}
                          />
                          {touched.firstName && errors.firstName && (
                            <FormHelperText error>{errors.firstName}</FormHelperText>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <Box marginBottom={1}>
                          <InputLabel htmlFor="personal-last-name" sx={{ mb: 1 }}>Last Name</InputLabel>
                          <OutlinedInput
                            onChange={handleChange}
                            fullWidth
                            name='lastName'
                            value={values.lastName || ''}
                            placeholder="Last Name"
                            error={touched.lastName && Boolean(errors.lastName)}
                          />
                          {touched.lastName && errors.lastName && (
                            <FormHelperText error>{errors.lastName}</FormHelperText>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} marginBottom={1}>
                      <Grid item xs={12} sm={12} md={6}>
                        <Box marginBottom={1}>
                          <InputLabel htmlFor="personal-email-address" sx={{ mb: 1 }}>Email Address</InputLabel>
                          <OutlinedInput
                            onChange={handleChange}
                            fullWidth
                            name='emailAddress'
                            value={values.emailAddress || ''}
                            placeholder="Email Address"
                            error={touched.emailAddress && Boolean(errors.emailAddress)}
                          />
                          {touched.emailAddress && errors.emailAddress && (
                            <FormHelperText error>{errors.emailAddress}</FormHelperText>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <Box marginBottom={1}>
                          <InputLabel htmlFor="personal-phone-number" sx={{ mb: 1 }}>Phone Number</InputLabel>
                          <OutlinedInput
                            fullWidth
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={`+63 ${values.phoneNumber || ''}`}
                            onChange={handlePhoneChange}
                            placeholder="+63 955 394 2621"
                            inputProps={{
                              inputMode: "numeric",
                              maxLength: 14,
                            }}
                            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                          />
                          {touched.phoneNumber && errors.phoneNumber && (
                            <FormHelperText error>{errors.phoneNumber}</FormHelperText>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                    <Stack direction='row' marginBlock={4} justifyContent='flex-end'>
                      <AnimateButton>
                        <LoadingButton
                          loading={isSubmitting}
                          disableElevation
                          disabled={isSubmitting}
                          loadingPosition="start"
                          fullWidth
                          variant="contained"
                          color="primary"
                          style={{ width: '150px' }}
                          type='submit'
                        >
                          Save
                        </LoadingButton>
                      </AnimateButton>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </React.Fragment>
  );
};

export default EditProfile;
