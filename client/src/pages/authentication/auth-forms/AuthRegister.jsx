import { useEffect, useState } from 'react';

// api
import agent from 'api'

// material-ui
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { React } from 'mdi-material-ui';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import LoadingButton from 'components/@extended/LoadingButton';
import useAuth from 'hooks/useAuth';
import AvatarUpload from 'components/dropzone/AvatarUpload';
import MainCard from 'components/MainCard';
import { MenuItem, Select } from '@mui/material';
import { USER_ROLES, USER_TYPES } from 'constants/constants';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister({ type = "CUSTOMER", isFromRegister = true, handleClose = () => { } }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          avatar: [],
          firstName: '',
          lastName: '',
          emailAddress: '',
          phoneNumber: '',
          password: '',
          position: ''
        }}
        onSubmit={async (values) => {
          try {
            const formData = new FormData()
            const _values = { ...values, position: values.position ? values.position : type, status: "ACTIVE" }

            Object.keys(_values).forEach((key) => {
              if (key === 'avatar' && _values[key].length > 0) {
                formData.append('avatar', _values[key][0]);
              } else {
                formData.append(key, _values[key]);
              }
            });

            const response = await agent.Users.addUsers(formData)
            toast.success(response?.data?.message, {
              position: "top-right",
              autoClose: 3000,
            });
            toast.info(`A confirmation email has been sent to ${values.emailAddress}`, {
              position: "top-right",
              autoClose: 5000,
            });

            handleClose()

            if (isFromRegister) {
              await login(values.emailAddress, values.password)
              navigate("/portal/dashboard")
            }
          } catch (error) {
            toast.error(error?.message || "Something went wrong", {
              position: "top-right",
              autoClose: 6000,
            });
          }
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          emailAddress: Yup.string().email('Must be a valid emailAddress').max(255).required('Email is required'),
          phoneNumber: Yup.string()
            .required("Phone Number is required")
            .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
          password: Yup.string().max(255).required('Password is required'),
          position: Yup.string()
            .max(255, 'Maximum 255 characters')
            .when('isFromRegister', {
              is: false,
              then: (schema) => schema.required('Position is required'),
              otherwise: (schema) => schema.notRequired(),
            }),
        })}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => {
          const handlePhoneChange = (e) => {
            const input = e.target.value.replace(/\D/g, "");
            const numberOnly = input.startsWith("63") ? input.slice(2) : input;
            if (numberOnly.length <= 10) {
              setFieldValue("phoneNumber", numberOnly);
            }
          };

          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {!isFromRegister && (
                  <Grid item sm={12} marginBottom={1} >
                    <MainCard>
                      <InputLabel htmlFor="avatart-signup">Avatar</InputLabel>
                      <Stack alignItems='center'>
                        <AvatarUpload
                          file={values.avatar}
                          setFieldValue={(field, value) => setFieldValue('avatar', value)}
                          error={touched.avatar && errors.avatar}
                        />
                      </Stack>
                    </MainCard>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="firstName-signup">First Name*</InputLabel>
                    <OutlinedInput
                      id="firstName-login"
                      type="firstName"
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="John"
                      fullWidth
                      error={Boolean(touched.firstName && errors.firstName)}
                    />
                  </Stack>
                  {touched.firstName && errors.firstName && (
                    <FormHelperText error id="helper-text-firstName-signup">
                      {errors.firstName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="lastName-signup">Last Name*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.lastName && errors.lastName)}
                      id="lastName-signup"
                      type="lastName"
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Doe"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.lastName && errors.lastName && (
                    <FormHelperText error id="helper-text-lastName-signup">
                      {errors.lastName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="emailAddress-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.emailAddress && errors.emailAddress)}
                      id="emailAddress-login"
                      type="emailAddress"
                      value={values.emailAddress}
                      name="emailAddress"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="demo@company.com"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.emailAddress && errors.emailAddress && (
                    <FormHelperText error id="helper-text-emailAddress-signup">
                      {errors.emailAddress}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="phoneNumber">Phone Number*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={`+63 ${values.phoneNumber}`}
                      onBlur={handleBlur}
                      onChange={handlePhoneChange}
                      placeholder="+63 955 394 2621"
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 14,
                      }}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <FormHelperText error id="helper-text-phoneNumber">
                        {errors.phoneNumber}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                {!isFromRegister && (
                  <Grid item xs={5}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="position-signup">Position</InputLabel>
                      <Select
                        fullWidth
                        name="position"
                        value={values.position}
                        onChange={(e) => setFieldValue('position', e.target.value)}
                        error={Boolean(touched.position && errors.position)}
                      >
                        {USER_TYPES.filter((f) => f.value !== USER_ROLES.CUSTOMER.value).map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.position && errors.position && (
                        <FormHelperText error id="helper-text-position">
                          {errors.position}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12} display='flex' justifyContent='center'>
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
                      Create Account
                    </LoadingButton>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )
        }}
      </Formik >
    </>
  );
}
