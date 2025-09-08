import { Typography } from '@mui/material'
import SuccessPage from 'components/SuccessPage'
import React from 'react'

const SuccessReservation = () => {
  return (
    <SuccessPage
      heading="Reservation Successful"
      message={<Typography>
        Your reservation has been successfully made! We look forward to welcoming you. <br /> A confirmation email has been sent to your registered email address.
      </Typography>}
    />
  )
}

export default SuccessReservation