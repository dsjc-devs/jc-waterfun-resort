import { Box, Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

const EmptyLongCard = () => {
  return (
    <Grid container spacing={4} alignItems="center" marginBlock={2}>
      <Grid item xs={12} md={5}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 2 }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={7}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '100%',
        }}
      >
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Skeleton variant="rounded" width={120} height={32} />
          <Skeleton variant="rounded" width={140} height={32} />
          <Skeleton variant="rounded" width={160} height={32} />
        </Stack>

        <Box mt={2}>
          <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Grid>
    </Grid>
  )
}

export default EmptyLongCard