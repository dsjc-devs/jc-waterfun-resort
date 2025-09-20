import React from 'react'
import { useGetSinglePolicy } from 'api/policies'
import { useLocation, useNavigate } from 'react-router'
import { useFormik } from 'formik'
import { OutlinedInput, Button, Box, Grid, Typography, Skeleton, Stack } from '@mui/material'
import { toast } from 'react-toastify'

import agent from 'api'
import MainCard from 'components/MainCard'
import Editor from 'components/Editor'
import AnimateButton from 'components/@extended/AnimateButton'
import LoadingButton from 'components/@extended/LoadingButton'
import FormWrapper from 'components/FormWrapper'

const Form = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const policyId = queryParams.get('id');

  const { data, isLoading } = useGetSinglePolicy({ id: policyId })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: data?.title || '',
      content: data?.content || '',
      type: data?.type || '',
    },
    onSubmit: async (values) => {
      try {
        const response = await agent.Policies.updatePolicyById(policyId, values)
        toast.success('Policy updated successfully')
        navigate('/portal/content-management/policies')

        return response
      } catch (error) {
        toast.error('Failed to update policy')
        console.error('Error updating policy:', error)
      }
    },
  })

  return (
    <React.Fragment>
      <FormWrapper
        title="Policy Information"
        caption="Fields marked with * are required."
      >
        {isLoading && (
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="rectangular" width="100%" height={120} sx={{ my: 2 }} />
            <Skeleton variant="text" width={200} height={40} />
          </Box>
        )}

        {!isLoading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Title *</Typography>
                <OutlinedInput
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography>Content *</Typography>
                <MainCard>
                  <Editor
                    content={{ ...formik.getFieldProps('content'), value: data?.content || formik.values.content }}
                    formik={formik.setFieldValue}
                    field='content'
                  />
                </MainCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </FormWrapper>

      <Stack
        direction='row'
        justifyContent='flex-end'
        spacing={2}
        sx={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          width: '100%',
          p: 2,
          borderTop: '1px solid rgba(238,238,238,0.8)',
          background: (theme) => theme.palette.background.paper,
          zIndex: 10
        }}
      >
        <AnimateButton>
          <Button>
            Cancel
          </Button>
        </AnimateButton>

        <AnimateButton>
          <LoadingButton
            loading={formik.isSubmitting}
            disableElevation
            disabled={formik.isSubmitting}
            loadingPosition="start"
            variant="contained"
            color="primary"
            onClick={formik.handleSubmit}
            sx={{ width: "150px" }}
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </LoadingButton>
        </AnimateButton>
      </Stack>
    </React.Fragment>
  )
}

export default Form