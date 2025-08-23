import React from 'react'

import PageTitle from 'components/PageTitle'
import FAQSPage from 'sections/dynamic-pages/FAQSPage'

const FAQs = () => {
  return (
    <React.Fragment>
      <PageTitle title="FAQs" isOnportal={false} />
      <FAQSPage />

    </React.Fragment>
  )
}

export default FAQs