import { Grid, Typography, Box, Button } from '@mui/material'
import { EyeOutlined } from '@ant-design/icons'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import ConvertDate from 'components/ConvertDate'
import formatPeso from 'utils/formatPrice'
import AnimateButton from 'components/@extended/AnimateButton'

const LongAccommodationCard = ({ data }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    if (data?._id) {
      navigate(`/portal/accommodations/details/${data._id}`)
    }
  }

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

        {(data?.type !== "guest_house" && data?.isDayMode) && (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: data?.isDayMode ? "warning.main" : "primary.dark",
            }}
          >
            {data?.isDayMode ? "Day Tour" : "Night Tour"}
          </Typography>
        )}

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
              Stay Duration:
            </Typography>
            <Typography variant="body1">
              {data?.maxStayDuration || 0} hours
            </Typography>
          </Grid>
        </Grid>

        {data?.startDate && data?.endDate && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Booking Dates:
            </Typography>
            <Typography variant="body1">
              <ConvertDate dateString={data?.startDate} time /> →{" "}
              <ConvertDate dateString={data?.endDate} time />
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <AnimateButton>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EyeOutlined />}
              onClick={handleViewDetails}
              disabled={!data?._id}
            >
              View Details
            </Button>
          </AnimateButton>
        </Box>
      </Grid>
    </Grid>
  )
}

export default LongAccommodationCard