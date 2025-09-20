import { EditOutlined } from '@ant-design/icons'
import { Dialog, DialogTitle, DialogContent, Typography, Box, DialogActions, Stack, Button } from '@mui/material'
import { useNavigate } from 'react-router'

import AnimateButton from 'components/@extended/AnimateButton'
import ConvertDate from 'components/ConvertDate'
import Editor from 'components/Editor'
import MainCard from 'components/MainCard'
import React from 'react'

const PolicyDetails = ({
  data = {},
  open = false,
  handleClose = () => { }
}) => {
  const navigate = useNavigate()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {data.title || 'Policy Details'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Created: <ConvertDate dateString={data?.createdAt} />
          </Typography>
        </Box>
        <MainCard>
          <Editor
            readonly={true}
            content={{
              value: data.content || ''
            }}
          />
        </MainCard>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Stack direction='row' spacing={2}>
          <AnimateButton>
            <Button
              size='small'
              onClick={handleClose}
            >
              Close
            </Button>
          </AnimateButton>

          <AnimateButton>
            <Button
              variant='contained'
              color='info'
              size='small'
              startIcon={<EditOutlined />}
              onClick={() => navigate(`/portal/content-management/policies/form?isEditMode=true&id=${data._id}`)}
            >
              Edit
            </Button>
          </AnimateButton>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default PolicyDetails