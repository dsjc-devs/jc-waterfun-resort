import React from 'react';

import { APP_DEFAULT_PATH } from 'config/config';
import { useGetResortDetails } from 'api/resort-details';
import { useFormik } from 'formik';
import { Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import { toast } from 'react-toastify';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import agent from 'api';

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Content Management - About Us' },
];

const AboutUs = () => {
  const { resortDetails, mutate } = useGetResortDetails();
  const { aboutUs } = resortDetails || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      mission: aboutUs?.mission || '',
      vision: aboutUs?.vision || '',
      goals: aboutUs?.goals || '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        await agent.ResortDetails.editResortDetails(formData);

        toast.success('About Us successfully updated.');
        await mutate();
      } catch (error) {
        toast.error(error?.message || 'Error occurred in saving.');
      } finally {
        setSubmitting(false);
      }
    },

  });

  return (
    <>
      <PageTitle title="About Us" />

      <Breadcrumbs
        custom
        heading="About Us"
        links={breadcrumbLinks}
        subheading="Manage the resort's story, mission, vision, and general information displayed on the website."
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <MainCard title="About Us Details">
            <Grid container spacing={2}>
              <Grid item xs={12} marginBottom={1}>
                <InputLabel htmlFor="mission">Mission</InputLabel>
                <OutlinedInput
                  id="mission"
                  name="mission"
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Enter the resort's mission statement"
                  value={formik.values.mission}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} marginBottom={1}>
                <InputLabel htmlFor="vision">Vision</InputLabel>
                <OutlinedInput
                  id="vision"
                  name="vision"
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Enter the resort's vision statement"
                  value={formik.values.vision}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} marginBottom={1}>
                <InputLabel htmlFor="goals">Goals</InputLabel>
                <OutlinedInput
                  id="goals"
                  name="goals"
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Enter the resort's goals"
                  value={formik.values.goals}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" spacing={1} margin={2}>
        <AnimateButton>
          <LoadingButton
            loading={formik.isSubmitting}
            disableElevation
            disabled={formik.isSubmitting}
            loadingPosition="start"
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
            sx={{ width: 150 }}
          >
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </LoadingButton>
        </AnimateButton>
      </Stack>
    </>
  );
};

export default AboutUs;
