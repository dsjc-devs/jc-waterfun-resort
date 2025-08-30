import { Grid, Typography, Box } from '@mui/material'

import React from 'react'
import ConvertDate from 'components/ConvertDate'
import formatPeso from 'utils/formatPrice'

const LongAccommodationCard = ({ data }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Box
          component="img"
          src={data?.thumbnail}
          sx={{
            width: "100%",
            objectFit: "cover",
            aspectRatio: "16/9",
            borderRadius: 1,
          }}
        />
      </Grid>

      <Grid item xs={12} md={9}>
        <Typography variant="h5">{data?.name}</Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: data?.isDayMode ? "warning.main" : "primary.dark",
          }}
        >
          {data?.isDayMode ? "Day Tour" : "Night Tour"}
        </Typography>

        <Grid container spacing={2} mt={1} alignItems="center">
          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Price:
            </Typography>
            <Typography variant="body1">
              {formatPeso(data?.price)}
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Capacity:
            </Typography>
            <Typography variant="body1">
              {data?.capacity || 0} guests
            </Typography>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" color="textSecondary">
              Max Hours:
            </Typography>
            <Typography variant="body1">
              {data?.maxStayDuration || 0} hours
            </Typography>
          </Grid>
        </Grid>

        {data?.selectedDate && data?.endDate && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Booking Dates:
            </Typography>
            <Typography variant="body1">
              <ConvertDate dateString={data?.selectedDate} time /> →{" "}
              <ConvertDate dateString={data?.endDate} time />
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default LongAccommodationCard