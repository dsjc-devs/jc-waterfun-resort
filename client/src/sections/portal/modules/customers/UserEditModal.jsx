import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AvatarUpload from 'components/dropzone/AvatarUpload';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  emailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email Address is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone Number must be digits only')
    .nullable(),
  status: Yup.string().oneOf(['ACTIVE', 'INACTIVE', 'BANNED', 'ARCHIVED']).required('Status is required'),
});

const UserEditModal = ({ open, onClose, formData, onSave, isSaving }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Typography variant="h3" padding={2}>
        Edit Customer
      </Typography>
      <DialogContent dividers>
        <Formik
          initialValues={{
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            emailAddress: formData.emailAddress || '',
            phoneNumber: formData.phoneNumber || '',
            status: formData.status || 'ACTIVE',
            avatar: formData.avatar || '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSave(values);
          }}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => {
            const handlePhoneChange = (e) => {
              const input = e.target.value.replace(/\D/g, "");
              const numberOnly = input.startsWith("63") ? input.slice(2) : input;
              if (numberOnly.length <= 10) {
                setFieldValue("phoneNumber", numberOnly);
              }
            };
            return (
              <Form>
                <Stack spacing={2} mt={1}>
                  <Stack justifyContent='center' alignItems='center'>
                    <AvatarUpload
                      file={values.avatar}
                      setFieldValue={(field, value) =>
                        setFieldValue('avatar', value)
                      }
                      initialFile={values.avatar}
                    />
                    {values.avatar && (
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => setFieldValue('avatar', '')}
                        sx={{ mt: 1 }}
                      >
                        Clear Avatar
                      </Button>
                    )}
                  </Stack>

                  <Box>
                    <Typography variant="subtitle2">First Name</Typography>
                    <TextField
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">Last Name</Typography>
                    <TextField
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">Email Address</Typography>
                    <TextField
                      name="emailAddress"
                      value={values.emailAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={touched.emailAddress && Boolean(errors.emailAddress)}
                      helperText={touched.emailAddress && errors.emailAddress}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">Phone Number</Typography>
                    <TextField
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
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Status</Typography>
                    <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
                      <Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="BANNED">Banned</MenuItem>
                        <MenuItem value="ARCHIVED">Archived</MenuItem>
                      </Select>
                      {touched.status && errors.status && (
                        <Typography variant="caption" color="error">{errors.status}</Typography>
                      )}
                    </FormControl>
                  </Box>
                </Stack>
                <DialogActions>
                  <Button onClick={onClose} disabled={isSaving}>
                    Cancel
                  </Button>
                  <AnimateButton>
                    <LoadingButton
                      loading={isSaving}
                      variant="contained"
                      type="submit"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </LoadingButton>
                  </AnimateButton>
                </DialogActions>
              </Form>
            )
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
