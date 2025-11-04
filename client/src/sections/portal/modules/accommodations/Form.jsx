import React from 'react';
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
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router';
import { UserOutlined } from '@ant-design/icons';
import { useGetAccommodationTypes } from 'api/accomodation-type';
import { FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { NO_CATEGORY } from 'constants/constants';

import * as Yup from "yup";
import agent from 'api';
import FormWrapper from 'components/FormWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import MultiFileUpload from 'components/dropzone/MultiFile';
import Editor from 'components/Editor';
import MainCard from 'components/MainCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import textFormatter from 'utils/textFormatter';
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
  thumbnailIndex: Yup.number()
    .typeError("Please select a thumbnail from the pictures")
    .required("Please select a thumbnail from the pictures")
    .min(0, "Invalid thumbnail selection"),
  notes: Yup.string().required("Notes are required"),
});

const AccommodationForm = ({ data = {}, _type = '', isLoading = false, isEditMode = false }) => {
  const { accomodationTypes = [] } = useGetAccommodationTypes();
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
      thumbnailIndex: (() => {
        if (!data?.thumbnail || !Array.isArray(data?.pictures)) return 0;
        const idx = data.pictures.findIndex((p) => p.image === data.thumbnail);
        return idx >= 0 ? idx : 0;
      })(),
      isMultiple: false,
      count: 1,
      isUpdateSameType: false,
      hasPoolAccess: data?.hasPoolAccess || false,
      isFeatured: data?.isFeatured || false,
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
        formData.append("hasPoolAccess", values.hasPoolAccess);

        if (isEditMode) {
          formData.append("isFeatured", values.isFeatured);
        }

        // send selected picture index as thumbnail
        formData.append('thumbnailIndex', String(values.thumbnailIndex ?? 0));

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

  // MultiFile handles removal internally and will adjust thumbnailIndex via setFieldValue
  const handleSelectThumbnail = (index) => {
    formik.setFieldValue('thumbnailIndex', index);
  };

  const formattedType = textFormatter.fromSlug(_type)

  return (
    <React.Fragment>
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
                    {data?.groupKey && (
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
                    )}

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

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formik.values.isFeatured}
                            onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
                            name="isFeatured"
                            color="warning"
                          />
                        }
                        label={
                          <Box>
                            Featured Accommodation
                            <Typography variant="caption" color="textSecondary" display="block">
                              Mark as featured to display prominently on the homepage. Only 3 accommodations can be featured at a time.
                            </Typography>
                          </Box>
                        }
                      />
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.hasPoolAccess}
                        onChange={(e) => formik.setFieldValue("hasPoolAccess", e.target.checked)}
                        name="hasPoolAccess"
                      />
                    }
                    label={
                      <Box>
                        Pool Access Available
                        <Typography variant="caption" color="textSecondary" display="block">
                          Check this if this accommodation includes access to the swimming pool.
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

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
                    disabled={!!_type && !isEditMode}
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

                <Grid item xs={12}>
                  <Typography variant='body1'>Pictures (Required)</Typography>
                  <Typography variant='caption' color='textSecondary'>Click a picture to set it as the thumbnail/cover.</Typography>
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
                  <MainCard >
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
              position: "sticky",
              bottom: 10,
              width: "100%",
              py: 2,
              borderTop: "1px solid rgba(238, 238, 238, .8)",
              background: (theme) => theme.palette.secondary.contrastText
            }}
          >
            <AnimateButton>
              <Button onClick={() => navigate(`/portal/accommodations?type=${_type}`)}>Back</Button>
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
