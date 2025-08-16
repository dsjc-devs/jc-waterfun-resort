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
  Select
} from '@mui/material';

import { UserOutlined } from '@ant-design/icons';
import { useGetAccommodationTypes } from 'api/accomodationsType';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import agent from 'api';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import FormWrapper from 'components/FormWrapper';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import SingleFileUpload from 'components/dropzone/FileUpload';
import MultiFileUpload from 'components/dropzone/MultiFile';
import textFormatter from 'utils/textFormatter';
import WYSIWYG from 'components/Editor';
import MainCard from 'components/MainCard';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

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
      thumbnail: data?.thumbnail || []
    },
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
          await agent.Accommodations.editAccommodation(data?._id, formData);
        } else {
          await agent.Accommodations.addAccommodation(formData);
        }

        toast.success(`Accommodation ${isEditMode ? 'updated' : 'created'} successfully!`);
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

  return (
    <React.Fragment>
      <PageTitle title={`Accommodation - ${isEditMode ? 'Edit' : 'Create'}`} />

      <Breadcrumbs
        custom
        heading={isEditMode ? `Edit ${data?.name}` : `Create New Accommodation`}
        links={
          isEditMode
            ? [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: data?.name, to: `/portal/accommodations/details/${id}` },
              { title: 'Edit Form' }
            ]
            : [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: 'Create Accommodation' }
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
        <React.Fragment>
          <Alert severity='info' color={isEditMode ? 'warning' : 'info'}>
            {!isEditMode ? 'Add Mode' : 'Edit Mode'}
          </Alert>

          <FormWrapper
            title={isEditMode ? 'Edit Accommodation Information' : 'Accommodation Information'}
            caption={
              isEditMode
                ? `Modify the information below to update ${data?.name}.`
                : 'Complete the form below to create a new accommodation.'
            }
          >
            <Grid container spacing={2}>
              {isEditMode && (
                <Grid item xs={6}>
                  <Typography variant='body1'>Status *</Typography>
                  <TextField
                    select
                    name='status'
                    value={formik.values.status}
                    onChange={(e) => formik.setFieldValue("status", e.target.value)}
                    fullWidth
                  >
                    {['POSTED', 'ARCHIVED'].map((statusOption) => (
                      <MenuItem
                        key={statusOption}
                        value={statusOption}
                        disabled={formik.values.status === statusOption}
                      >
                        {statusOption}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant='body1'>Accommodation Name *</Typography>
                <TextField
                  name='name'
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder='e.g. Deluxe Room, Kubo, Beachfront Cottage'
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant='body1'>Accommodation Type *</Typography>
                <Autocomplete
                  value={formik.values.type && `${textFormatter.fromSlug(formik.values.type)}`}
                  onChange={(event, newValue) => {
                    let valueToSet;
                    if (typeof newValue === 'string') {
                      valueToSet = newValue;
                    } else if (newValue?.inputValue) {
                      valueToSet = newValue.inputValue;
                    } else {
                      valueToSet = newValue?.title || '';
                    }

                    formik.setFieldValue('type', textFormatter.toSlug(valueToSet));
                  }}
                  filterOptions={(options, params) => {
                    const filtered = options.filter((option) =>
                      option.title.toLowerCase().includes(params.inputValue.toLowerCase())
                    );

                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => option.title.toLowerCase() === inputValue.toLowerCase()
                    );
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `Add "${inputValue}"`
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  freeSolo
                  options={accomodationTypes}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.inputValue || option.title)}
                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Select or add type'
                      fullWidth
                      variant='outlined'
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body1'>Description *</Typography>
                <TextField
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder='Provide a short description of the accommodation.'
                  fullWidth
                  multiline
                  rows={5}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant='body1'>Price (Day) *</Typography>
                <TextField
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
                <Typography variant='body1'>Price (Night) *</Typography>
                <TextField
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
                <Typography variant='body1'>Extra Person Fee *</Typography>
                <TextField
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

              <Grid item xs={12} md={6}>
                <Typography variant='body1'>Maximum Capacity (Pax) *</Typography>
                <TextField
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
                <Typography variant='body1'>Maximum Stay Duration (Hours) *</Typography>
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

              <Grid item xs={12} md={5}>
                <Typography variant='body1'>Thumbnail *</Typography>
                <SingleFileUpload
                  fieldName='thumbnail'
                  file={formik.values.thumbnail || ''}
                  setFieldValue={formik.setFieldValue}
                  error={formik.errors.thumbnail}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='body1'>Pictures *</Typography>
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
                <Typography variant='body1'>Notes *</Typography>
                <MainCard >
                  <WYSIWYG
                    content={{ ...formik.getFieldProps('notes') }}
                    formik={formik.setFieldValue}
                    field='notes'
                  />
                </MainCard>
              </Grid>
            </Grid>

            <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={1}>
              <AnimateButton>
                <Button onClick={() => navigate('/portal/dashboard')}>Back</Button>
              </AnimateButton>

              <AnimateButton>
                <LoadingButton
                  loading={formik.isSubmitting}
                  disableElevation
                  disabled={formik.isSubmitting}
                  loadingPosition='start'
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={formik.handleSubmit}
                  sx={{ width: "150px" }}
                >
                  {formik.isSubmitting ? 'Saving...' : 'Save'}
                </LoadingButton>
              </AnimateButton>
            </Stack>
          </FormWrapper>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AccommodationForm;
