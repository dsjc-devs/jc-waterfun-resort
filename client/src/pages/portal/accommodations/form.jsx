import React from 'react';
import { APP_DEFAULT_PATH } from 'config/config';
import { useGetSingleAccommodation } from 'api/accommodations';
import { useLocation, useNavigate } from 'react-router';
import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  Box,
  FormHelperText,
  Checkbox,
  FormControlLabel
} from '@mui/material';

import { UserOutlined } from '@ant-design/icons';
import { useGetAccommodationTypes } from 'api/accomodationsType';
import { FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { NO_CATEGORY } from 'constants/constants';

import agent from 'api';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import FormWrapper from 'components/FormWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import SingleFileUpload from 'components/dropzone/FileUpload';
import MultiFileUpload from 'components/dropzone/MultiFile';
import Editor from 'components/Editor';
import MainCard from 'components/MainCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import textFormatter from 'utils/textFormatter';
import * as Yup from "yup";
import FormikTextInput from 'components/@extended/FormikTextInput';

const validationSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(["POSTED", "ARCHIVED", "UNPOSTED"])
    .when("$isEditMode", {
      is: true,
      then: (schema) => schema.required("Status is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long"),
  type: Yup.string().required("Type is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  dayPrice: Yup.number()
    .typeError("Day price must be a number")
    .required("Day price is required")
    .positive("Day price must be greater than 0"),
  nightPrice: Yup.number()
    .typeError("Night price must be a number")
    .required("Night price is required")
    .positive("Night price must be greater than 0"),
  extraPersonFee: Yup.number()
    .typeError("Extra person fee must be a number")
    .nullable()
    .min(0, "Extra person fee must not be negative"),
  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  maxStayDuration: Yup.number()
    .typeError("Maximum stay duration must be a number")
    .required("Maximum stay duration is required")
    .min(1, "Minimum duration is 1 hour")
    .max(24, "Maximum duration is 24 hours"),
  files: Yup.array()
    .min(1, "At least one picture is required"),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
  notes: Yup.string().required("Notes are required"),
});

const AccommodationForm = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get('id');
  const isEditMode = !!searchParams.get('isEditMode');
  const _type = searchParams.get('type')

  const { accomodationTypes = [] } = useGetAccommodationTypes();
  const { data, isLoading } = useGetSingleAccommodation(id) || {};
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      status: data?.status || '',
      name: data?.name || '',
      notes: data?.notes || '',
      type: (_type && _type) || data?.type || '',
      description: data?.description || '',
      dayPrice: data?.price?.day || '',
      nightPrice: data?.price?.night || '',
      extraPersonFee: data?.extraPersonFee || '',
      capacity: data?.capacity || '',
      maxStayDuration: data?.maxStayDuration || '',
      files: data?.pictures?.map((pic) => ({
        preview: pic.image,
        name: pic._id || pic.image.split('/').pop(),
        isExisting: true
      })) || [],
      thumbnail: data?.thumbnail || [],
      isMultiple: false,
      count: 1,
      isUpdateSameType: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        values.files.forEach((file) => {
          if (!file.isExisting) formData.append('pictures', file);
        });
        const existingFiles = values.files
          .filter(f => f.isExisting)
          .map(f => ({ image: f.preview }));
        formData.append('existingFiles', JSON.stringify(existingFiles));

        formData.append('name', values.name);
        formData.append('type', values.type);
        formData.append('description', values.description);
        formData.append('price.day', values.dayPrice);
        formData.append('price.night', values.nightPrice);
        formData.append('extraPersonFee', values.extraPersonFee);
        formData.append('capacity', values.capacity);
        formData.append('maxStayDuration', values.maxStayDuration);
        formData.append('notes', values.notes);

        if (values.thumbnail instanceof File) {
          formData.append('thumbnail', values.thumbnail);
        } else if (typeof values.thumbnail === 'string') {
          formData.append('thumbnail', values.thumbnail);
        }

        if (isEditMode) {
          formData.append("status", values.status)
          formData.append("isUpdateSameType", values.isUpdateSameType)
          await agent.Accommodations.editAccommodation(data?._id, formData);
        } else {
          formData.append("count", values.count);
          await agent.Accommodations.addAccommodation(formData);
        }

        toast.success(`${formattedType} ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate(`/portal/accommodations?type=${formik.values.type}`)
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Something went wrong!');
      }
    }
  });

  const handleRemoveFile = (file) => {
    const updatedFiles = formik.values.files.filter(f => f !== file);
    formik.setFieldValue('files', updatedFiles);
  };

  const formattedType = textFormatter.fromSlug(_type)

  return (
    <React.Fragment>
      <PageTitle title={`${formattedType} - ${isEditMode ? 'Edit' : 'Create'}`} />

      <Breadcrumbs
        custom
        heading={isEditMode ? `Edit Form` : `Create New ${formattedType}`}
        links={
          isEditMode
            ? [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: data?.name, to: `/portal/accommodations/details/${id}` },
              { title: 'Edit' }
            ]
            : [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: `Create ${formattedType}` }
            ]
        }
        subheading={
          isEditMode
            ? `Update details, rates, and availability for ${data?.name}.`
            : 'Add a new accommodation including details, images, and rates.'
        }
      />

      {isLoading && <EmptyUserCard title='Loading....' />}

      {!isLoading && (
        <Box position='relative'>
          <Alert severity='info' color={isEditMode ? 'warning' : 'info'}>
            {!isEditMode ? 'Add Mode' : 'Edit Mode'}
          </Alert>

          <FormikProvider value={formik}>
            <FormWrapper
              title={isEditMode ? `Edit ${data?.name} Information` : `${formattedType} Information`}
              caption={
                isEditMode
                  ? `Modify the information below to update ${data?.name}.`
                  : 'Complete the form below to create a new accommodation.'
              }
            >
              <Grid container spacing={2}>
                {isEditMode && (
                  <React.Fragment>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.isUpdateSameType}
                            onChange={(e) => formik.setFieldValue("isUpdateSameType", e.target.checked)}
                            name="isUpdateSameType"
                          />
                        }
                        label="Update all accommodations in this group"
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant='body1'>Status (Required)</Typography>
                      <FormikTextInput
                        variant="outlined"
                        select
                        name='status'
                        value={formik.values.status}
                        onChange={(e) => formik.setFieldValue("status", e.target.value)}
                        fullWidth
                        error={formik.touched && !!formik.errors.status}
                      >
                        {['POSTED', 'ARCHIVED', 'UNPOSTED'].map((statusOption) => (
                          <MenuItem
                            key={statusOption}
                            value={statusOption}
                            disabled={formik.values.status === statusOption}
                          >
                            {statusOption}
                          </MenuItem>
                        ))}
                        {formik.touched.status && formik.errors.status && (
                          <FormHelperText error id="helper-text-status">
                            {formik.errors.status}
                          </FormHelperText>
                        )}
                        /</FormikTextInput>
                    </Grid>
                  </React.Fragment>
                )}

                {!isEditMode && (
                  <React.Fragment>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.isMultiple}
                            onChange={(e) => formik.setFieldValue("isMultiple", e.target.checked)}
                            name="isMultiple"
                          />
                        }
                        label="Create multiple accommodations"
                      />
                    </Grid>

                    {formik.values.isMultiple && (
                      <Grid item xs={12} md={4}>
                        <Typography variant="body1">Count (Required)</Typography>
                        <FormikTextInput
                          variant="outlined"
                          name="count"
                          value={formik.values.count}
                          onChange={formik.handleChange}
                          fullWidth
                          type="number"
                          placeholder="e.g. 5"
                          InputProps={{
                            inputProps: { min: 1 },
                          }}
                        />
                      </Grid>
                    )}
                  </React.Fragment>
                )}

                <Grid item xs={12}>
                  <Typography variant='body1'>Name (Required)</Typography>
                  <FormikTextInput
                    name='name'
                    variant="outlined"
                    value={formik.values.name}
                    placeholder='e.g. Deluxe Room, Kubo, Beachfront Cottage'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant='body1'>Type (Required)</Typography>
                  <Select
                    fullWidth
                    name='type'
                    value={formik.values.type || ''}
                    onChange={formik.handleChange}
                  >
                    {accomodationTypes?.filter((f) => f.title !== NO_CATEGORY).map((item) => (
                      <MenuItem key={item._id} value={item.slug}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='body1'>Description (Required)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='description'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder='Provide a short description of the accommodation.'
                    fullWidth
                    isTextArea
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant='body1'>Price (Day) (Required)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='dayPrice'
                    value={formik.values.dayPrice}
                    onChange={formik.handleChange}
                    fullWidth
                    type='number'
                    placeholder='e.g. 1500'
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₱</InputAdornment>
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant='body1'>Price (Night) (Required)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='nightPrice'
                    value={formik.values.nightPrice}
                    onChange={formik.handleChange}
                    fullWidth
                    type='number'
                    placeholder='e.g. 2000'
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₱</InputAdornment>
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant='body1'>Maximum Stay Duration (Hours) (Required)</Typography>
                  <Select
                    fullWidth
                    name='maxStayDuration'
                    value={formik.values.maxStayDuration || ''}
                    onChange={formik.handleChange}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant='body1'>Maximum Capacity (Pax) (Required)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='capacity'
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    fullWidth
                    type='number'
                    placeholder='Maximum number of guests, e.g. 4'
                    startAdornment={<InputAdornment position='start'><UserOutlined /></InputAdornment>}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant='body1'>Extra Person Fee (Optional)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='extraPersonFee'
                    value={formik.values.extraPersonFee}
                    onChange={formik.handleChange}
                    fullWidth
                    type='number'
                    placeholder='e.g. 500'
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>₱</InputAdornment>
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <Typography variant='body1'>Thumbnail (Required)</Typography>
                  <SingleFileUpload
                    fieldName='thumbnail'
                    file={formik.values.thumbnail || ''}
                    setFieldValue={formik.setFieldValue}
                    error={formik.errors.thumbnail}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='body1'>Pictures (Required)</Typography>
                  <MultiFileUpload
                    setFieldValue={formik.setFieldValue}
                    files={formik.values.files || []}
                    onRemove={handleRemoveFile}
                    error={formik.touched.files && !!formik.errors.files}
                    hideButton={true}
                    showList={true}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography variant='body1'>Notes (Required)</Typography>
                  <MainCard >
                    <Editor
                      content={{ ...formik.getFieldProps('notes') }}
                      formik={formik.setFieldValue}
                      field='notes'
                    />
                  </MainCard>
                </Grid>
              </Grid>
            </FormWrapper>
          </FormikProvider>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{
              position: "sticky",
              bottom: 10,
              width: "100%",
              py: 2,
              borderTop: "1px solid rgba(238, 238, 238, .8)",
              background: (theme) => theme.palette.secondary.contrastText
            }}
          >
            <AnimateButton>
              <Button onClick={() => navigate("/portal/dashboard")}>Back</Button>
            </AnimateButton>

            <AnimateButton>
              <LoadingButton
                loading={formik.isSubmitting}
                disableElevation
                disabled={formik.isSubmitting || Object.keys(formik.errors).length > 0}
                loadingPosition="start"
                variant="contained"
                color="primary"
                onClick={formik.handleSubmit}
                sx={{ width: "150px" }}
              >
                {formik.isSubmitting ? "Saving..." : "Save"}
              </LoadingButton>
            </AnimateButton>
          </Stack>
        </Box>
      )}
    </React.Fragment>
  );
};

export default AccommodationForm;
