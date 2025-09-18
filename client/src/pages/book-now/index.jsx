import React from 'react'
import PageTitle from 'components/PageTitle'
import UnderConstruction from 'pages/maintenance/under-construction'

const BookNow = () => {
  return (
    <React.Fragment>
      <PageTitle title='Book Now' isOnportal={false} />

      <UnderConstruction />
    </React.Fragment>
  )
}

export default BookNow