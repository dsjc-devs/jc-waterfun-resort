import React from 'react'

import PageTitle from 'components/PageTitle'
import FAQSPage from 'sections/dynamic-pages/FAQSPage'
import TitleTag from 'components/TitleTag'

const FAQs = () => {
  return (
    <React.Fragment>
      <PageTitle title="FAQs" isOnportal={false} />
      <FAQSPage />

    </React.Fragment>
  )
}

export default FAQs