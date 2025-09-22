import { useGetSingleAccommodation } from 'api/accommodations';
import { APP_DEFAULT_PATH } from 'config/config';
import { useLocation } from 'react-router';

import React from 'react'
import textFormatter from 'utils/textFormatter';
import Form from 'sections/portal/modules/accommodations/Form'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle'

const AccommodationForm = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const id = searchParams.get('id');
  const isEditMode = !!searchParams.get('isEditMode');
  const _type = searchParams.get('type')
  const formattedType = textFormatter.fromSlug(_type)

  const { data, isLoading } = useGetSingleAccommodation(id) || {};

  return (
    <React.Fragment>
      <PageTitle title={`${formattedType} - ${isEditMode ? 'Edit' : 'Create'}`} />
      <Breadcrumbs
        custom
        heading={isEditMode ? `Edit Form` : `Create New ${formattedType}`}
        links={
          isEditMode
            ? [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: data?.name, to: `/portal/accommodations/details/${id}` },
              { title: 'Edit' }
            ]
            : [
              { title: 'Home', to: APP_DEFAULT_PATH },
              { title: formattedType, to: `/portal/accommodations?type=${_type}` },
              { title: `Create ${formattedType}` }
            ]
        }
        subheading={
          isEditMode
            ? `Update details, rates, and availability for ${data?.name}.`
            : 'Add a new accommodation including details, images, and rates.'
        }
      />

      <Form
        isLoading={isLoading}
        _type={_type}
        data={data}
        isEditMode={isEditMode}
      />
    </React.Fragment>
  )
}

export default AccommodationForm