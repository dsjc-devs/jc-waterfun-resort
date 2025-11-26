import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useGetAmenities } from "api/amenities";
import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";

const AmenitySelector = ({
  amenitiesQuantities = {},
  onAmenitiesChange,
  title = "Resort Amenities",
  subtitle = "Enhance your experience",
  description = "Choose from our available amenities for your stay",
  variant = "enhanced" // "enhanced" for booking page, "simple" for admin form
}) => {
  const { data: amenitiesData = {} } = useGetAmenities({ status: 'POSTED' });
  const amenitiesList = Array.isArray(amenitiesData?.amenities) ? amenitiesData.amenities : [];

  const amenitiesTotal = amenitiesList.reduce((sum, a) => {
    if (!a?.hasPrice) return sum;
    const q = Number(amenitiesQuantities?.[a._id] || 0);
    const price = Number(a?.price || 0);
    return sum + q * price;
  }, 0);

  const clearAmenities = () => onAmenitiesChange && onAmenitiesChange({});

  if (variant === "simple") {
    return (
      <MainCard sx={{ maxHeight: 320, overflowY: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="body2" color="secondary">Select quantities for add-ons</Typography>
          <Button size="small" variant="text" onClick={clearAmenities} sx={{ textDecoration: 'underline' }}>
            Clear Amenities
          </Button>
        </Stack>
        <Grid container spacing={2}>
          {amenitiesList.filter(a => a?.hasPrice).map((a) => {
            const q = Number(amenitiesQuantities[a._id] || 0);
            return (
              <Grid item xs={12} key={a._id}>
                <MainCard>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6">{a.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{formatPeso(a.price || 0)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Select
                        size="small"
                        value={q > 0 ? 1 : 0}
                        onChange={(e) => {
                          const val = Number(e.target.value || 0);
                          const clamped = Math.min(1, Math.max(0, val));
                          onAmenitiesChange && onAmenitiesChange({ ...amenitiesQuantities, [a._id]: clamped });
                        }}
                        sx={{ minWidth: 180 }}
                      >
                        <MenuItem value={0}>Not Included</MenuItem>
                        <MenuItem value={1}>Include</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="subtitle1" fontWeight={700}>Amenities Total: {formatPeso(amenitiesTotal)}</Typography>
        </Box>
      </MainCard>
    );
  }

  return (
    <Box sx={{ borderBottom: "1px solid #eee", p: 2, mt: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          pl: 2,
          borderLeft: (theme) => `5px solid ${theme.palette.primary.light}`,
        }}
      >
        {title}
      </Typography>

      <MainCard sx={{ background: (theme) => theme.palette.grey[50] }}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1" color="text.primary" fontWeight={500} gutterBottom>
                {subtitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={clearAmenities}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 2
              }}
            >
              Clear All
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {amenitiesList.filter(a => a?.hasPrice).map((a) => {
            const q = Number(amenitiesQuantities?.[a._id] || 0);
            const isSelected = q > 0;

            return (
              <Grid item xs={12} key={a._id}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'grey.300',
                    backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: isSelected ? 'primary.dark' : 'primary.light',
                      backgroundColor: isSelected ? 'primary.100' : 'grey.50',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => theme.shadows[4]
                    }
                  }}
                  onClick={() => {
                    const newVal = isSelected ? 0 : 1;
                    onAmenitiesChange && onAmenitiesChange({ ...amenitiesQuantities, [a._id]: newVal });
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'primary.main' : 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isSelected && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                backgroundColor: 'white',
                                borderRadius: '50%'
                              }}
                            />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600} color={isSelected ? 'primary.dark' : 'text.primary'}>
                            {a.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            One per reservation • Available during your stay
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color={isSelected ? 'primary.main' : 'text.primary'}
                        >
                          {formatPeso(a.price || 0)}
                        </Typography>
                        <Select
                          size="small"
                          value={q > 0 ? 1 : 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            const val = Number(e.target.value || 0);
                            const clamped = Math.min(1, Math.max(0, val));
                            onAmenitiesChange && onAmenitiesChange({ ...amenitiesQuantities, [a._id]: clamped });
                          }}
                          sx={{
                            minWidth: 140,
                            '& .MuiSelect-select': {
                              backgroundColor: isSelected ? 'primary.main' : 'background.paper',
                              color: isSelected ? 'white' : 'text.primary',
                              fontWeight: 500
                            }
                          }}
                        >
                          <MenuItem value={0}>Not Included</MenuItem>
                          <MenuItem value={1}>✓ Include</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {amenitiesTotal > 0 && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary.dark" fontWeight={600}>
                Total Amenities Cost
              </Typography>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                {formatPeso(amenitiesTotal)}
              </Typography>
            </Stack>
          </Box>
        )}
      </MainCard>
    </Box>
  );
};

export default AmenitySelector;