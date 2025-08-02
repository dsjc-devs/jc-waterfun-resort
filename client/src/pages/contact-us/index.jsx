import React, { useState } from 'react';
import PageTitle from 'components/PageTitle';
import TitleTag from 'components/TitleTag';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack
} from '@mui/material';

import Logo from 'assets/images/logo/logo.png';
import address from 'layout/footer-items/address';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const validate = () => {
    const tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!formData.mobile.trim()) {
      tempErrors.mobile = 'Mobile Number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.mobile.trim())) {
      tempErrors.mobile = 'Invalid mobile number format';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const allFieldsFilled = ['firstName', 'lastName', 'email', 'mobile', 'subject', 'message']
    .every(field => formData[field].trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmittedData(formData);
      setShowModal(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      alert('Failed to submit. Please try again.');
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    setSubmitted(true);
  };

  return (
    <React.Fragment>
      <PageTitle title="Contact Us" isOnportal={false} />
      <Box sx={{ px: 4, py: 6 }}>
        <TitleTag title="Contact Us" />

        <Grid container spacing={4} justifyContent="center" alignItems="flex-start" mt={6} paddingInline={10}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                border: '1px solid #839CAA',
                padding: '3px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              <Typography variant="h6" color="#00B2FF">Contact Us</Typography>
            </Box>
            <Typography variant="h1" sx={{ mt: 3 }}>
              If you have any questions, feel free to reach out to us!
            </Typography>
            <Typography variant="body1" color="#839CAA" sx={{ mt: 2 }}>
              Feel free to contact us, and we'll do our best to provide the information or support your needs.
              Your satisfaction is our priority, and we look forward to addressing any queries you may have.
              Thank you for choosing us!
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>

                  <TextField
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    fullWidth
                    error={!!errors.subject}
                    helperText={errors.subject}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    required
                    fullWidth
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    required
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!allFieldsFilled}
                  fullWidth
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Panel: Contact Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <img src={Logo} alt="logo" style={{ maxWidth: '45%', height: 'auto' }} />
            </Box>
            <Box sx={{ textAlign: 'center', padding: '45px', border: '1px solid #839CAA', borderRadius: '4px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" color="#000000" paddingBottom={5}>Contact Information</Typography>
              {address.map((ad, index) => (
                <Stack key={ad.name} direction="row" alignItems="center" spacing={2} mb={1.5}>
                  {React.createElement(ad.icon, {
                    style: {
                      color: index === 0 ? ad.color : '#000000',
                      fontSize: 18
                    }
                  })}
                  <Typography variant="subtitle2" color="#000000">
                    {ad.name}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={submitted}
          autoHideDuration={3000}
          onClose={() => setSubmitted(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSubmitted(false)} sx={{ width: '100%' }}>
            Message sent successfully!
          </Alert>
        </Snackbar>

        {/* Confirmation Dialog */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '30px' }}>
            Thank You for Contacting Us!
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h4" gutterBottom>
              Here's a summary of your message:
            </Typography>

            {submittedData && (
              <Box sx={{ my: 2 }}>
                <Typography sx={{ wordSpacing: '10px' }}><strong>FirstName:</strong> {submittedData.firstName}</Typography>
                <Typography sx={{ wordSpacing: '10px' }}><strong>LastName:</strong> {submittedData.lastName}</Typography>
                <Typography sx={{ wordSpacing: '10px' }}><strong>Email:</strong> {submittedData.email}</Typography>
                <Typography sx={{ wordSpacing: '10px' }}><strong>Mobile:</strong> {submittedData.mobile}</Typography>
                <Typography sx={{ wordSpacing: '10px' }}><strong>Subject:</strong> {submittedData.subject}</Typography>
                <Typography sx={{ wordSpacing: '10px', mt: 2 }}><strong>Message:</strong></Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', ml: 2 }}>
                  {submittedData.message}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirm} color="primary" variant="contained">Confirm</Button>
            <Button onClick={() => setShowModal(false)} color="secondary" autoFocus>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </React.Fragment>
  );
};

export default ContactUs;
