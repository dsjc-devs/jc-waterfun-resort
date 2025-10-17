import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Box,
  Grid,
  TextField,
  Typography,
  Stack,
  Container,
  Divider,
  Chip
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTheme } from '@mui/material/styles'
import { EnvironmentFilled, MailFilled, PhoneFilled } from '@ant-design/icons'
import ReCaptcha from 'components/ReCaptcha'

import { useGetResortDetails } from 'api/resort-details'
import agent from 'api'
import Logo from 'components/logo/LogoMain'
import MainCard from 'components/MainCard'
import { toast } from 'react-toastify'

const ContactUsSection = () => {
  const theme = useTheme()
  // use react-toastify for toasts
  const { resortDetails } = useGetResortDetails()
  const { companyInfo } = resortDetails || {}
  const {
    address,
    emailAddress,
    phoneNumber,
    operatingHours,
    name: companyName
  } = companyInfo || {}
  const { streetAddress, city, province, country } = address || {}

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  const initialFormState = useMemo(() => ({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    subject: '',
    remarks: ''
  }), [])

  const [formValues, setFormValues] = useState(initialFormState)
  const [formErrors, setFormErrors] = useState({})
  const [captchaToken, setCaptchaToken] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recaptchaRef = useRef(null)

  const fullAddress = useMemo(() => {
    const segments = [streetAddress, city, province, country].filter(Boolean)
    return segments.length ? segments.join(', ') : 'We will update our address shortly.'
  }, [streetAddress, city, province, country])

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const validateForm = useCallback(() => {
    const errors = {}

    if (!formValues.firstName?.trim()) errors.firstName = 'First name is required.'
    if (!formValues.lastName?.trim()) errors.lastName = 'Last name is required.'

    if (!formValues.emailAddress?.trim()) {
      errors.emailAddress = 'Email address is required.'
    } else {
      const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
      if (!emailPattern.test(formValues.emailAddress.trim())) {
        errors.emailAddress = 'Enter a valid email address.'
      }
    }

    if (formValues.phoneNumber?.trim()) {
      const digits = formValues.phoneNumber.replace(/[^0-9]/g, '')
      if (digits.length < 7 || digits.length > 11) {
        errors.phoneNumber = 'Mobile number should be 7 to 11 digits.'
      }
    }

    if (!formValues.subject?.trim()) errors.subject = 'Subject is required.'
    if (!formValues.remarks?.trim()) errors.remarks = 'Message is required.'

    if (!captchaToken) {
      errors.recaptcha = 'Complete the captcha to continue.'
    }

    return errors
  }, [captchaToken, formValues])

  const resetForm = useCallback(() => {
    setFormValues(initialFormState)
    setCaptchaToken(null)
    setFormErrors({})
    recaptchaRef.current?.reset()
  }, [initialFormState, recaptchaRef])

  // compute whether the form is valid (no validation errors)
  const isFormValid = useMemo(() => {
    const errors = validateForm()
    return Object.keys(errors).length === 0
  }, [validateForm])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length) {
      setFormErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...formValues,
        phoneNumber: formValues.phoneNumber?.trim() || undefined,
        recaptchaToken: captchaToken
      }

      await agent.ContactUs.submitContact(payload)
      toast.success('Thanks for reaching out! We will get back to you soon.')
      resetForm()
    } catch (error) {
      const message = error?.message || 'Unable to submit your request right now.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [captchaToken, formValues, resetForm, validateForm])

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaToken(value)
    setFormErrors((prev) => ({ ...prev, recaptcha: undefined }))
  }, [])

  const handleCaptchaExpired = useCallback(() => {
    recaptchaRef.current?.reset()
    setCaptchaToken(null)
    setFormErrors((prev) => ({ ...prev, recaptcha: 'Captcha expired, please try again.' }))
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 6, md: 8 },
        background: theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : `linear-gradient(135deg, ${theme.palette.primary.light}0a, ${theme.palette.primary.main}14)`
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <MainCard
              sx={{
                height: '100%',
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: theme.palette.mode === 'dark'
                  ? theme.palette.background.paper
                  : '#ffffffee'
              }}
            >
              <Chip
                label="We respond within 24 hours"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', mb: 2 }}
              />

              <Typography variant="h3" fontFamily="Cinzel">
                Let’s plan your perfect getaway
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                Share a few details and our reservations team will reach out with tailored suggestions,
                exclusive offers, and answers to any questions you have about {companyName}.
              </Typography>

              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      value={formValues.firstName}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.firstName)}
                      helperText={formErrors.firstName}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="lastName"
                      label="Last Name"
                      value={formValues.lastName}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.lastName)}
                      helperText={formErrors.lastName}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="emailAddress"
                      label="Email Address"
                      type="email"
                      value={formValues.emailAddress}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.emailAddress)}
                      helperText={formErrors.emailAddress}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phoneNumber"
                      label="Mobile Number"
                      value={formValues.phoneNumber}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.phoneNumber)}
                      helperText={formErrors.phoneNumber || 'Optional but helps us serve you faster.'}
                      fullWidth
                      inputMode="tel"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="subject"
                      label="Subject"
                      value={formValues.subject}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.subject)}
                      helperText={formErrors.subject}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="remarks"
                      label="Message"
                      value={formValues.remarks}
                      onChange={handleInputChange}
                      error={Boolean(formErrors.remarks)}
                      helperText={formErrors.remarks || 'Tell us about your ideal stay, date preference, or special requests.'}
                      fullWidth
                      multiline
                      minRows={4}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
                      {recaptchaSiteKey ? (
                        <ReCaptcha
                          ref={recaptchaRef}
                          siteKey={recaptchaSiteKey}
                          onChange={handleCaptchaChange}
                          onExpired={handleCaptchaExpired}
                        />
                      ) : (
                        <Typography variant="body2" color="error">
                          Captcha is not configured. Please contact support.
                        </Typography>
                      )}
                      {formErrors.recaptcha && (
                        <Typography variant="caption" color="error">
                          {formErrors.recaptcha}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  loading={isSubmitting}
                  disabled={!isFormValid || isSubmitting}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Send Message
                </LoadingButton>

                <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
                  By submitting this form you agree to receive follow-up communication from {companyName}.
                </Typography>
              </Box>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3} height="100%">
              <MainCard
                sx={{
                  flexGrow: 1,
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: theme.palette.mode === 'dark'
                    ? theme.palette.background.paper
                    : '#ffffffcc'
                }}
              >
                <Stack alignItems="center" spacing={2}>
                  <Logo isPadded />
                  <Typography variant="h5" fontFamily="Cinzel" textAlign="center">
                    Contact Information
                  </Typography>
                </Stack>

                <Divider flexItem>
                  <Chip label="Resort HQ" size="small" color="primary" variant="outlined" />
                </Divider>

                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <EnvironmentFilled style={{ color: theme.palette.error.main, fontSize: 22 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Visit Us
                      </Typography>
                      <Typography variant="body2">{fullAddress}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <PhoneFilled style={{ color: theme.palette.primary.light, fontSize: 22 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Call Us
                      </Typography>
                      <Typography variant="body2">{phoneNumber || 'Call us soon for inquiries.'}</Typography>
                      <Typography variant="caption" color="text.disabled">
                        Daily from {operatingHours || '8:00 AM to 8:00 PM'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <MailFilled style={{ color: theme.palette.primary.dark, fontSize: 22 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Us
                      </Typography>
                      <Typography variant="body2">{emailAddress || 'hello@jcwaterfunresort.com'}</Typography>
                      <Typography variant="caption" color="text.disabled">
                        We aim to reply within one business day.
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </MainCard>

              <MainCard
                sx={{
                  p: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(144, 202, 249, 0.08)'
                    : 'linear-gradient(135deg, rgba(33,150,243,0.12), rgba(25,118,210,0.16))'
                }}
              >
                <Typography variant="subtitle1" fontFamily="Cinzel">
                  Prefer a direct email?
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Send us a message at <strong>{emailAddress || 'hello@jcwaterfunresort.com'}</strong> and our guest experience
                  specialists will coordinate the next steps for your visit.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  {companyName} respects your privacy. Your details will be used solely to assist with your inquiry.
                </Typography>
              </MainCard>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ContactUsSection