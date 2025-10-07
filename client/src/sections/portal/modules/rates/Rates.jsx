import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Stack
} from '@mui/material';
import { useGetResortRates } from 'api/resort-rates';
import { toast } from 'react-toastify';

import agent from 'api';
import formatPeso from 'utils/formatPrice';

const initialState = {
  entranceFee: {
    adult: { day: '', night: '' },
    child: { day: '', night: '' },
    pwdSenior: { day: '', night: '' }
  }
};

const categories = [
  { key: 'adult', label: 'Adult', color: 'primary' },
  { key: 'child', label: 'Children', color: 'success' },
  { key: 'pwdSenior', label: 'PWD/Senior', color: 'warning' }
];

const Rates = () => {
  const { resortRates, isLoading, error: apiError, mutate } = useGetResortRates();
  const [editing, setEditing] = useState(false);
  const [localRates, setLocalRates] = useState(initialState);

  const displayRates = editing ? localRates : resortRates || initialState;

  const handleEdit = () => {
    setEditing(true);
    setLocalRates(resortRates || initialState);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleChange = (type, field, value) => {
    setLocalRates(prev => ({
      ...prev,
      entranceFee: {
        ...prev.entranceFee,
        [type]: {
          ...prev.entranceFee[type],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      await agent.ResortRates.updateResortRates(localRates);
      toast.success('Rates updated successfully.');
      setEditing(false);
      await mutate();
    } catch (err) {
      toast.error(err.message || 'Error updating rates.');
    }
  };

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <Typography variant="h6">Loading rates...</Typography>
    </Box>
  );
  if (apiError) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
      <Typography color="error">Failed to fetch rates.</Typography>
    </Box>
  );

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {categories.map(({ key, label, color }) => (
          <Grid item xs={12} md={4} key={key}>
            <Card
              sx={{
                height: '100%',
                borderLeft: `6px solid`,
                borderColor: `${color}.main`,
                boxShadow: 2,
                bgcolor: editing ? 'background.paper' : 'grey.50'
              }}
            >
              <CardContent>
                <Typography variant="h6" color={color} gutterBottom>
                  {label}
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Day Rate
                  </Typography>
                  {editing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={displayRates.entranceFee[key]?.day}
                      onChange={e => handleChange(key, 'day', e.target.value)}
                      InputProps={{ startAdornment: <span>₱</span> }}
                      sx={{ width: '100%', mt: 1 }}
                    />
                  ) : (
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {formatPeso(displayRates.entranceFee[key]?.day)}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Night Rate
                  </Typography>
                  {editing ? (
                    <TextField
                      type="number"
                      size="small"
                      value={displayRates.entranceFee[key]?.night}
                      onChange={e => handleChange(key, 'night', e.target.value)}
                      InputProps={{ startAdornment: <span>₱</span> }}
                      sx={{ width: '100%', mt: 1 }}
                    />
                  ) : (
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {formatPeso(displayRates.entranceFee[key]?.night)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
        {editing ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleEdit}>
            Edit Rates
          </Button>
        )}
      </Stack>
    </React.Fragment>
  );
};

export default Rates;