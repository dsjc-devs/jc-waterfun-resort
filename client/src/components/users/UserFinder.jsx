import { useGetUsers } from 'api/users';
import React from 'react';
import { Autocomplete, TextField, Avatar, Stack, Typography, Box } from '@mui/material';

const UserFinder = ({ isCustomerFinder = true, value, onChange }) => {
  const { data } = useGetUsers({ queryObj: isCustomerFinder ? { "position.value": "CUSTOMER" } : {} });
  const users = data?.users || [];

  return (
    <Autocomplete
      options={users}
      getOptionLabel={option => `${option.firstName} ${option.lastName}`}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={option.avatar} alt={option.firstName} />
            <Box>
              <Typography variant="body1" fontWeight={600}>{option.firstName} {option.lastName}</Typography>
              <Typography variant="body2" color="text.secondary">{option.emailAddress}</Typography>
              <Typography variant="caption" color="text.secondary">ID: {option.userId}</Typography>
            </Box>
          </Stack>
        </Box>
      )}
      value={value || null}
      onChange={(e, newValue) => onChange?.(newValue)}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      renderInput={params => (
        <TextField {...params} placeholder="Search by name, email, or ID" fullWidth />
      )}
    />
  );
};

export default UserFinder;