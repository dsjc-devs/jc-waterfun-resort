import React from 'react';

import { APP_DEFAULT_PATH } from 'config/config';
import { useGetResortDetails } from 'api/resort-details';
import { useFormik } from 'formik';
import { Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { toast } from 'react-toastify';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import MainCard from 'components/MainCard';
import SingleFileUpload from 'components/dropzone/FileUpload';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import agent from 'api';

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Content Management - Company Info' },
];

const CompanyInfo = () => {
  const { resortDetails, mutate } = useGetResortDetails()
  const { companyInfo } = resortDetails || {}

  const {
    logo,
    name,
    emailAddress,
    phoneNumber,
    address
  } = companyInfo || {}

  const {
    streetAddress,
    city,
    province,
    country
  } = address || {}

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      logo: logo || "",
      name: name || "",
      emailAddress: emailAddress || "",
      phoneNumber: phoneNumber || "",
      streetAddress: streetAddress || "",
      city: city || "",
      province: province || "",
      country: country || ""
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key === 'logo') {
            if (typeof values.logo === 'string') {
              formData.append('logo', values.logo);
            } else if (values.logo instanceof File) {
              formData.append('logo', values.logo);
            }
          } else {
            formData.append(key, values[key]);
          }
        });

        await agent.ResortDetails.editResortDetails(formData);
        toast.success('Company Info successfully updated.');

        await mutate()
      } catch (error) {
        toast.error(error?.message || 'Error occurred in saving.');
      } finally {
        setSubmitting(false);
      }
    }
  })

  return (
    <React.Fragment>
      <PageTitle title="Company Info" />

      <Breadcrumbs
        custom
        heading="Company Info"
        links={breadcrumbLinks}
        subheading="Manage the resort's contact details, location, business hours, and other company information."
      />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={12}>
          <MainCard title="Logo">
            <Stack justifyContent='center' alignItems='center'>
              <SingleFileUpload
                fieldName="logo"
                file={formik.values.logo || ""}
                setFieldValue={formik.setFieldValue}
                error={formik.errors.logo}
                sx={{ width: "400px" }}
              />
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={12}>
          <MainCard>
            <Grid container spacing={2}>
              <Grid item xs={12} marginBlockEnd={1}>
                <MainCard title="Contact Information">
                  <Grid container spacing={2}>
                    <Grid item xs={12} marginBlockEnd={1}>
                      <InputLabel>Name</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='name'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        placeholder='Enter company name'
                      />
                    </Grid>

                    <Grid item xs={6} marginBlockEnd={1}>
                      <InputLabel>Email Address</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='emailAddress'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.emailAddress}
                        placeholder='Enter company email address'
                      />
                    </Grid>

                    <Grid item xs={6} marginBlockEnd={1}>
                      <InputLabel>Phone Number</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='phoneNumber'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                        placeholder='Enter company phone number'
                      />
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>

              <Grid item xs={12} marginBlockEnd={1}>
                <MainCard title="Address Information">
                  <Grid container spacing={2}>
                    <Grid item xs={12} marginBlockEnd={1}>
                      <InputLabel>Street Address</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='streetAddress'
                        rows={3}
                        multiline
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.streetAddress}
                        placeholder='e.g '
                      />
                    </Grid>

                    <Grid item xs={6} marginBlockEnd={1}>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='city'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                        placeholder='e.g Dasmariñas'
                      />
                    </Grid>

                    <Grid item xs={6} marginBlockEnd={1}>
                      <InputLabel>Province</InputLabel>
                      <OutlinedInput
                        fullWidth
                        name='province'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.province}
                        placeholder='e.g Cavite'
                      />
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack direction='row' justifyContent='flex-end' spacing={1} margin={2}>
        <AnimateButton>
          <LoadingButton
            loading={formik.isSubmitting}
            disableElevation
            disabled={formik.isSubmitting}
            loadingPosition="start"
            fullWidth
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
            sx={{ width: "150px" }}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </LoadingButton>
        </AnimateButton>
      </Stack>
    </React.Fragment>
  );
};

export default CompanyInfo;
