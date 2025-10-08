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
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Skeleton
} from '@mui/material';
import { ExpandMore, PolicyOutlined, HelpOutlineOutlined, SecurityOutlined } from '@mui/icons-material';

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
import { useGetPolicies } from 'api/policies';
import { useGetFAQS } from 'api/faqs';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister({ type = "CUSTOMER", isFromRegister = true, handleClose = () => { } }) {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const { data: policiesData, isLoading: policiesLoading } = useGetPolicies()
  const { data: faqsData, isLoading: faqsLoading } = useGetFAQS({ status: 'POSTED', limit: 5 })

  const policies = policiesData?.policies || []
  const faqs = faqsData?.faqs || []

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          confirmPassword: '',
          position: ''
        }}
        onSubmit={async (values) => {
          try {
            const formData = new FormData()
            const _values = { ...values, position: values.position ? values.position : type, status: "ACTIVE" }

            delete _values.confirmPassword;

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
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
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

                {/* Confirm Password Field */}
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="confirmPassword-signup">Confirm Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      id="confirmPassword-signup"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      name="confirmPassword"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                          >
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="******"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="helper-text-confirmPassword-signup">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>

                {(!isFromRegister && type !== "CUSTOMER") && (
                  <Grid item xs={5}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="position-signup">Position</InputLabel>
                      <Select
                        fullWidth
                        name="position"
                        value={values.position}
                        onChange={(e) => setFieldValue("position", e.target.value)}
                        error={Boolean(touched.position && errors.position)}
                      >
                        {USER_TYPES
                          .filter((f) => f.value !== USER_ROLES.CUSTOMER.value)
                          .filter((f) => {
                            if (user.position[0]?.value === USER_ROLES.MASTER_ADMIN.value) return true;
                            return f.value === USER_ROLES.RECEPTIONIST.value;
                          })
                          .map((option) => (
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

                {/* Policies Section */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      mb: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'primary.100',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.200',
                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: { xs: 'none', sm: '0 8px 25px rgba(0,0,0,0.1)' }
                      }
                    }}
                  >
                    <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: 'primary.50', borderBottom: '1px solid', borderColor: 'primary.100' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          color: 'primary.main',
                          fontSize: { xs: '0.85rem', sm: '0.875rem' }
                        }}
                      >
                        <PolicyOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                        Our Policies
                      </Typography>
                    </Box>
                    <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                      {policiesLoading ? (
                        <Stack spacing={1}>
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                          ))}
                        </Stack>
                      ) : (
                        <Stack spacing={1}>
                          {policies.length > 0 ? (
                            <>
                              {policies.slice(0, 3).map((policy) => (
                                <AnimateButton key={policy._id} type="scale" scale={{ hover: 1.02, tap: 0.98 }}>
                                  <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => navigate('/policies')}
                                    sx={{
                                      justifyContent: 'flex-start',
                                      textAlign: 'left',
                                      width: '100%',
                                      color: 'text.primary',
                                      py: { xs: 0.5, sm: 1 },
                                      px: { xs: 1, sm: 2 },
                                      borderRadius: 1,
                                      minHeight: { xs: 36, sm: 44 },
                                      '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                  >
                                    <Typography variant="body2" noWrap sx={{ flex: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                      {policy.title}
                                    </Typography>
                                  </Button>
                                </AnimateButton>
                              ))}
                              <AnimateButton type="scale">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  onClick={() => navigate('/policies')}
                                  sx={{
                                    mt: { xs: 0.5, sm: 1 },
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    py: { xs: 0.5, sm: 0.75 }
                                  }}
                                >
                                  View All Policies
                                </Button>
                              </AnimateButton>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                              No policies available at the moment.
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                {/* FAQ Section */}
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'warning.100',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderColor: 'warning.200',
                        transform: { xs: 'none', sm: 'translateY(-2px)' },
                        boxShadow: { xs: 'none', sm: '0 8px 25px rgba(0,0,0,0.1)' }
                      }
                    }}
                  >
                    <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: 'warning.50', borderBottom: '1px solid', borderColor: 'warning.100' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          color: 'warning.dark',
                          fontSize: { xs: '0.85rem', sm: '0.875rem' }
                        }}
                      >
                        <HelpOutlineOutlined sx={{ mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                        Frequently Asked Questions
                      </Typography>
                    </Box>
                    <Box>
                      {faqsLoading ? (
                        <Box sx={{ p: 2 }}>
                          <Stack spacing={2}>
                            {[1, 2, 3].map((i) => (
                              <Box key={i}>
                                <Skeleton variant="text" width="80%" height={20} />
                                <Skeleton variant="text" width="60%" height={16} />
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      ) : faqs.length > 0 ? (
                        faqs.slice(0, 4).map((faq, index) => (
                          <Accordion
                            key={faq._id}
                            elevation={0}
                            sx={{
                              '&:before': { display: 'none' },
                              '&.Mui-expanded': { margin: 0 },
                              '&:last-child': { borderBottom: 'none' }
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMore sx={{ color: 'text.secondary', fontSize: 18 }} />}
                              sx={{
                                px: 2,
                                minHeight: 44,
                                '& .MuiAccordionSummary-content': { my: 0.5 },
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                                {faq.title}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 2, pt: 0, pb: 1.5 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.8rem' }}>
                                {faq.answer}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))
                      ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            No FAQs available at the moment.
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                        <AnimateButton type="scale">
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate('/faqs')}
                            sx={{ fontSize: '0.75rem', fontWeight: 500 }}
                          >
                            View All FAQs →
                          </Button>
                        </AnimateButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          )
        }}
      </Formik >
    </>
  );
}
