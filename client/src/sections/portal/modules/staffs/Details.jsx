import React, { useState } from 'react'
import { useGetSingleUser } from 'api/users'
import { CloseOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Box, Dialog, Grid, Skeleton, Stack } from '@mui/material'
import { CardAccountDetailsOutline, MessageBulleted } from 'mdi-material-ui'
import { useSnackbar } from 'contexts/SnackbarContext'
import { USER_TYPES } from 'constants/constants'
import LabeledValue from 'components/LabeledValue'
import Logo from 'components/logo/LogoMain'
import MainCard from 'components/MainCard'
import IconButton from 'components/@extended/IconButton'
import ConfirmationDialog from 'components/ConfirmationDialog'
import agent from 'api'
import AnimateButton from 'components/@extended/AnimateButton'
import LoadingButton from 'components/@extended/LoadingButton'
import useAuth from 'hooks/useAuth'
import logo from 'assets/images/logo/logo-circular.png'

const Details = ({ open, handleClose, userId, mutate }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user: loggedInUser } = useAuth()
  const { user, isLoading } = useGetSingleUser(userId) ?? {}
  const { openSnackbar } = useSnackbar()

  const {
    avatar,
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    position
  } = user || {}

  const handleDelete = async () => {
    setLoading(true)
    try {
      await agent.Users.deleteUser(userId)
      openSnackbar({
        message: `Deleted successfully.`,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        alert: { color: 'success' },
        duration: 3000
      });
    } catch (error) {
      openSnackbar({
        message: error,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        alert: { color: 'error' },
        duration: 3000
      });
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      handleClose()
      await mutate()
    }
  }

  const isSameRole = loggedInUser?.position[0].value === user?.position[0].value
  const hasAccess = !isSameRole && loggedInUser?.position[0].value === USER_TYPES[0].value

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
        <Stack direction='row' alignItems='center' justifyContent='flex-end' margin={2}>
          <IconButton title='Close' color='secondary' onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <Box padding={2}>
          <MainCard>
            {isLoading ? (
              <Grid container spacing={2} alignItems='center'>
                <Grid item sm={12} md={6}>
                  <Skeleton variant="rectangular" height={390} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid item sm={12} md={6}>
                  {[...Array(4)].map((_, idx) => (
                    <Box key={idx} marginBottom={4}>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="80%" height={24} />
                    </Box>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} alignItems='center'>
                <Grid item sm={12} md={6}>
                  <MainCard>
                    <Box
                      component='img'
                      src={avatar || logo}
                      sx={{
                        width: '100%',
                        height: 390,
                        objectFit: 'cover',
                        borderRadius: 4.5
                      }}
                    />
                  </MainCard>
                </Grid>
                <Grid item sm={12} md={6}>
                  <Box marginBottom={4}>
                    <LabeledValue
                      title='Full Name'
                      subTitle={firstName?.concat(' ', lastName)}
                      icon={<UserOutlined />}
                    />
                  </Box>
                  <Box marginBottom={4}>
                    <LabeledValue
                      title='Email Address'
                      subTitle={emailAddress}
                      icon={<MailOutlined />}
                    />
                  </Box>
                  <Box marginBottom={4}>
                    <LabeledValue
                      title='Phone Number'
                      subTitle={mobileNumber}
                      icon={<PhoneOutlined />}
                    />
                  </Box>
                  <Box marginBottom={4}>
                    <LabeledValue
                      title='Position'
                      subTitle={position?.[0]?.label ?? ''}
                      icon={<CardAccountDetailsOutline />}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </MainCard>

          {!isLoading && hasAccess && (
            <Stack direction='row' alignItems='center' justifyContent='flex-end' margin={2} spacing={2}>
              <AnimateButton>
                <LoadingButton
                  loading={loading}
                  disableElevation
                  disabled={loading}
                  loadingPosition="start"
                  fullWidth
                  onClick={() => setOpenDeleteDialog(true)}
                  variant="contained"
                  color="error"
                  style={{ width: '120px' }}
                  startIcon={<DeleteOutlined />}
                >
                  Delete
                </LoadingButton>
              </AnimateButton>
            </Stack>
          )}
        </Box>
      </Dialog>

      <ConfirmationDialog
        title='Delete User'
        description='Are you sure you want to delete this user?'
        handleConfirm={handleDelete}
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
      />
    </React.Fragment>
  )

}

export default Details