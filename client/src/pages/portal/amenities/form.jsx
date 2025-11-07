import React from 'react';
import { APP_DEFAULT_PATH } from 'config/config';
import { useLocation, useNavigate } from 'react-router';
import {
  Alert,
  Button,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  MenuItem,
  Select,
  Box,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';

import { FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';

import agent from 'api';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import FormWrapper from 'components/FormWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import MultiFileUpload from 'components/dropzone/MultiFile';
import Editor from 'components/Editor';
import MainCard from 'components/MainCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import * as Yup from "yup";
import FormikTextInput from 'components/@extended/FormikTextInput';
import textFormatter from 'utils/textFormatter';
import { useGetAmenities, useGetSingleAmenity } from 'api/amenities';
import { useGetAmenityTypes } from 'api/amenity-type';
import { NO_CATEGORY } from 'constants/constants';

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
  hasPrice: Yup.boolean().default(false),
  price: Yup.number()
    .typeError("Price must be a number")
    .when('hasPrice', {
      is: true,
      then: (schema) => schema.required("Price is required").positive("Price must be greater than 0"),
      otherwise: (schema) => schema.notRequired(),
    }),
  files: Yup.array()
    .min(1, "At least one picture is required"),
  thumbnailIndex: Yup.number()
    .typeError("Please select a thumbnail from the pictures")
    .required("Please select a thumbnail from the pictures")
    .min(0, "Invalid thumbnail selection"),
  notes: Yup.string().required("Notes are required"),
});

const AmenityForm = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get('id');
  const isEditMode = !!searchParams.get('isEditMode');
  const _type = searchParams.get('type');

  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleAmenity(id);
  const { amenityTypes } = useGetAmenityTypes();

  const formik = useFormik({
    initialValues: {
      status: data?.status || '',
      name: data?.name || '',
      notes: data?.notes || '',
      type: (_type && _type) || data?.type || '',
      description: data?.description || '',
      hasPrice: !!data?.hasPrice || false,
      price: data?.price ?? '',
      files: data?.pictures?.map((pic) => ({
        preview: pic.image,
        name: pic._id || pic.image.split('/').pop(),
        isExisting: true
      })) || [],
      thumbnailIndex: (() => {
        if (!data?.thumbnail || !Array.isArray(data?.pictures)) return 0;
        const idx = data.pictures.findIndex((p) => p.image === data.thumbnail);
        return idx >= 0 ? idx : 0;
      })(),
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
        formData.append('hasPrice', String(values.hasPrice));
        if (values.hasPrice) {
          formData.append('price', String(values.price));
        }
        formData.append('notes', values.notes);

        // send selected picture index as thumbnail
        formData.append('thumbnailIndex', String(values.thumbnailIndex ?? 0));

        if (isEditMode) {
          formData.append("status", values.status);
          await agent.Amenities.editAmenityById(data?._id, formData);
        } else {
          await agent.Amenities.addAmenities(formData);
        }

        toast.success(`Amenity ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate(`/portal/amenities?type=${values.type}`);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Something went wrong!');
      }
    }
  });

  const handleSelectThumbnail = (index) => {
    formik.setFieldValue('thumbnailIndex', index);
  };

  return (
    <React.Fragment>
      <PageTitle title={`Amenity - ${isEditMode ? 'Edit' : 'Create'}`} />

      <Breadcrumbs
        custom
        heading={isEditMode ? `Edit Amenity` : `Create New Amenity`}
        links={
          isEditMode
            ? [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: data?.name, to: `/portal/amenities/details/${id}` },
              { title: 'Edit' }
            ]
            : [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: textFormatter.fromSlug(_type), to: `/portal/amenities?type=${_type}` },
              { title: 'Create Amenity' }
            ]
        }
        subheading={
          isEditMode
            ? `Update details and information for ${data?.name}.`
            : 'Add a new amenity including details, images, and pricing.'
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
              title={isEditMode ? `Edit ${data?.name} Information` : `Amenity Information`}
              caption={
                isEditMode
                  ? `Modify the information below to update ${data?.name}.`
                  : 'Complete the form below to create a new amenity.'
              }
            >
              <Grid container spacing={2}>
                {isEditMode && (
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
                    </FormikTextInput>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant='body1'>Name (Required)</Typography>
                  <FormikTextInput
                    name='name'
                    variant="outlined"
                    value={formik.values.name}
                    placeholder='e.g. Swimming Pool, Restaurant, Spa Treatment'
                  />
                </Grid>

                {(!!_type && isEditMode) && (
                  <Grid item xs={12} md={6}>
                    <Typography variant='body1'>Type (Required)</Typography>
                    <Select
                      fullWidth
                      name='type'
                      value={formik.values.type || ''}
                      onChange={formik.handleChange}
                    >
                      {amenityTypes?.filter(f => f.name !== NO_CATEGORY).map((item) => (
                        <MenuItem key={item.value} value={textFormatter.toSlug(item.name)}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.hasPrice}
                        onChange={(e) => {
                          formik.setFieldValue('hasPrice', e.target.checked);
                          if (!e.target.checked) {
                            formik.setFieldValue('price', '');
                          }
                        }}
                        color="primary"
                      />
                    }
                    label="Has Price?"
                  />
                  {formik.values.hasPrice && (
                    <>
                      <Typography variant='body1'>Price ({formik.values.hasPrice ? 'Required' : 'Optional'})</Typography>
                      <FormikTextInput
                        variant="outlined"
                        name='price'
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        fullWidth
                        type='number'
                        placeholder='e.g. 500'
                        InputProps={{
                          startAdornment: <InputAdornment position='start'>₱</InputAdornment>
                        }}
                      />
                    </>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='body1'>Description (Required)</Typography>
                  <FormikTextInput
                    variant="outlined"
                    name='description'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder='Provide a short description of the amenity.'
                    fullWidth
                    isTextArea
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='body1'>Pictures (Required)</Typography>
                  <MultiFileUpload
                    setFieldValue={formik.setFieldValue}
                    files={formik.values.files || []}
                    error={formik.touched.files && !!formik.errors.files}
                    hideButton={true}
                    showList={true}
                    selectedIndex={formik.values.thumbnailIndex}
                    onSelect={handleSelectThumbnail}
                  />
                  {formik.touched.thumbnailIndex && formik.errors.thumbnailIndex && (
                    <FormHelperText error id="helper-text-thumbnailIndex">
                      {formik.errors.thumbnailIndex}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <Typography variant='body1'>Notes (Required)</Typography>
                  <MainCard>
                    <Editor
                      content={{ ...formik.getFieldProps('notes'), value: data?.notes }}
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
              zIndex: 10,
              position: "sticky",
              bottom: 10,
              width: "100%",
              py: 2,
              borderTop: "1px solid rgba(238, 238, 238, .8)",
              background: (theme) => theme.palette.secondary.contrastText
            }}
          >
            <AnimateButton>
              <Button onClick={() => navigate(`/portal/amenities?type=${_type}`)}>Back</Button>
            </AnimateButton>

            <AnimateButton>
              <LoadingButton
                loading={formik.isSubmitting}
                disableElevation
                disabled={formik.isSubmitting}
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

export default AmenityForm;