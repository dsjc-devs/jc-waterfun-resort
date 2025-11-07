import React, { useState } from 'react';
import { APP_DEFAULT_PATH } from 'config/config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import { Box, Button, Grid, TextField, Typography, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useLocation } from 'react-router-dom';
import agent from 'api';
import { useGetBlockedDates } from 'api/blocked-dates';
import { useGetAccommodations } from 'api/accommodations';
import useGetPosition from 'hooks/useGetPosition';
import { toast } from 'react-toastify';

const BlockedDateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('id');
  const { isAdmin, isMasterAdmin } = useGetPosition();
  const { data: blockedDatesData, mutate } = useGetBlockedDates();
  const { data: accommodationsData } = useGetAccommodations({ sort: 'name' });
  const { accommodations = [] } = accommodationsData || {};

  if (!isAdmin && !isMasterAdmin) {
    return (
      <React.Fragment>
        <PageTitle title="Unauthorized" />
        <Breadcrumbs custom heading="Unauthorized" links={[{ title: 'Home', to: APP_DEFAULT_PATH }]} subheading="You do not have access to Blocked Dates." />
      </React.Fragment>
    );
  }

  const existing = Array.isArray(blockedDatesData) ? blockedDatesData.find(b => b._id === editId) : (blockedDatesData?.blockedDates || []).find(b => b._id === editId);

  const [form, setForm] = useState({
    startDate: existing?.startDate ? new Date(existing.startDate) : null,
    endDate: existing?.endDate ? new Date(existing.endDate) : null,
    reason: existing?.reason || '',
    isResortWide: existing ? !existing.accommodationId : true,
    accommodationId: existing?.accommodationId || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Blocked Dates', to: '/portal/blocked-dates' },
    { title: editId ? 'Edit Blocked Date' : 'New Blocked Date' }
  ];

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      toast.error('Start and End date are required');
      return;
    }
    if (form.startDate >= form.endDate) {
      toast.error('End date must be after start date');
      return;
    }
    setSubmitting(true);
    const payload = {
      startDate: form.startDate.toISOString(),
      endDate: form.endDate.toISOString(),
      reason: form.reason,
      accommodationId: form.isResortWide ? undefined : form.accommodationId,
      isFromReservation: false
    };
    try {
      if (editId) {
        await agent.BlockedDates.editBlockedDate(editId, payload);
        toast.success('Blocked date updated');
      } else {
        await agent.BlockedDates.createBlockedDate(payload);
        toast.success('Blocked date created');
      }
      mutate();
      navigate('/portal/blocked-dates');
    } catch (e) {
      toast.error(e.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <PageTitle title={editId ? 'Edit Blocked Date' : 'New Blocked Date'} />
      <Breadcrumbs
        custom
        heading={editId ? 'Edit Blocked Date' : 'Create Blocked Date'}
        links={breadcrumbLinks}
        subheading="Define a date range where reservations are disabled."
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Start Date"
                value={form.startDate}
                onChange={(newValue) => handleChange('startDate', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="End Date"
                value={form.endDate}
                onChange={(newValue) => handleChange('endDate', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                value={form.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                fullWidth
                placeholder="Reason for blocking (e.g., Maintenance, Holiday)"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={form.isResortWide} onChange={(e) => handleChange('isResortWide', e.target.checked)} />}
                label="Resort-wide Block"
              />
            </Grid>
            {!form.isResortWide && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Accommodation</InputLabel>
                  <Select
                    value={form.accommodationId}
                    label="Accommodation"
                    onChange={(e) => handleChange('accommodationId', e.target.value)}
                  >
                    {accommodations.map(acc => (
                      <MenuItem key={acc._id} value={acc._id}>{acc.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" disabled={submitting}>{submitting ? 'Submitting...' : editId ? 'Update' : 'Create'}</Button>
                <Button variant="outlined" onClick={() => navigate('/portal/blocked-dates')}>Cancel</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default BlockedDateForm;
