import React, { useMemo, useState } from 'react'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Stack, Tooltip, Typography } from '@mui/material'
import { useGetPolicies } from 'api/policies'
import { useNavigate } from 'react-router'

import IconButton from 'components/@extended/IconButton'
import ConvertDate from 'components/ConvertDate'
import ReusableTable from 'components/ReusableTable'
import PolicyDetails from './Details'

const PoliciesTable = () => {
  const { data } = useGetPolicies()
  const { policies = [] } = data || {}

  const [openDetails, setOpenDetails] = useState({
    open: false,
    data: {}
  })

  const navigate = useNavigate()

  const columns = useMemo(
    () => [
      {
        id: 'title',
        align: 'left',
        disablePadding: true,
        label: 'Title',
        renderCell: (row) => (
          <Typography variant='subtitle1'> {row?.title} </Typography>
        )
      },
      {
        id: 'createdAt',
        align: 'right',
        disablePadding: true,
        label: 'Date Created',
        renderCell: (row) => (
          <ConvertDate dateString={row?.createdAt} />
        )
      },
      {
        id: 'actions',
        label: '',
        align: 'center',
        renderCell: (row) => (
          <Stack direction="row" justifyContent='center' spacing={1}>
            <Tooltip title="View">
              <IconButton color="primary" onClick={() => setOpenDetails({ data: row, open: true })}>
                <EyeOutlined />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton color="info" onClick={() => navigate(`/portal/content-management/policies/form?isEditMode=true&id=${row._id}`)}>
                <EditOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    []
  );

  return (
    <React.Fragment>
      <ReusableTable
        searchableColumns={['title']}
        itemsPerPage={1}
        columns={columns}
        rows={policies}
        isLoading={false}
        noMessage="No policies found."
        settings={{
          otherActionButton: <></>
        }}
      />

      <PolicyDetails
        open={openDetails.open}
        data={openDetails.data}
        handleClose={() => setOpenDetails({ open: false, data: {} })}
      />
    </React.Fragment>
  )
}

export default PoliciesTable