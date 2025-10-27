import React, { useEffect, useState } from 'react'
import { Box, Dialog, Grid, Skeleton, Stack, OutlinedInput, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material'
import { CloseOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { useGetSingleUser } from 'api/users'
import { CardAccountDetailsOutline } from 'mdi-material-ui'
import { USER_ROLES, USER_STATUSSES, USER_TYPES } from 'constants/constants'

import LabeledValue from 'components/LabeledValue'
import MainCard from 'components/MainCard'
import IconButton from 'components/@extended/IconButton'
import ConfirmationDialog from 'components/ConfirmationDialog'
import agent from 'api'
import AnimateButton from 'components/@extended/AnimateButton'
import LoadingButton from 'components/@extended/LoadingButton'
import useAuth from 'hooks/useAuth'
import emptyUser from 'assets/images/users/empty-user.png'
import { useFormik } from 'formik'
import AvatarUpload from 'components/dropzone/AvatarUpload'
import titleCase from 'utils/titleCaseFormatter'

const Details = ({ mutate }) => {
  const queryParams = new URLSearchParams(window.location.search)
  const userId = queryParams.get("userId")
  const isEditModeQuery = queryParams.get('isEditMode') === 'true'

  const { user: loggedInUser } = useAuth()
  const { user: viewUser, isLoading, mutate: userMutate } = useGetSingleUser(userId) ?? {}
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      avatar: viewUser?.avatar || "",
      firstName: viewUser?.firstName || '',
      lastName: viewUser?.lastName || '',
      emailAddress: viewUser?.emailAddress || '',
      phoneNumber: viewUser?.phoneNumber || '',
      position: viewUser?.position?.[0]?.value || '',
      status: viewUser?.status || ''
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true)
      try {
        const formData = new FormData()
        Object.keys(values).forEach((key) => {
          if (key === 'avatar') {
            if (typeof values[key] === 'string') {
              formData.append('avatar', values[key]);
            } else if (values[key] && values[key].length > 0) {
              formData.append('avatar', values[key][0]);
            }
          } else {
            formData.append(key, values[key]);
          }
        });


        await agent.Users.editUser(userId, formData)
        toast.success("User successfully Edited", {
          position: "top-right",
          autoClose: 3000,
        });

        handleClose()
        await mutate()
        await userMutate()
      } catch (error) {
        toast.error(error?.message || "Something went wrong", {
          position: "top-right",
          autoClose: 6000,
        });
      } finally {
        formik.setSubmitting(false)
      }
    }
  })

  const {
    avatar,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    position,
    status
  } = viewUser || {}

  // ----- Permission logic (align with Table.jsx) -----
  const currentRole = loggedInUser?.position?.[0]?.value
  const targetRole = viewUser?.position?.[0]?.value
  const isSameUser = loggedInUser?.userId && viewUser?.userId && (loggedInUser.userId === viewUser.userId)
  const isTargetMasterAdmin = targetRole === USER_ROLES.MASTER_ADMIN.value
  const isSameRole = !!targetRole && !!currentRole && targetRole === currentRole

  const roleCanManage = currentRole === USER_ROLES.MASTER_ADMIN.value || currentRole === USER_ROLES.ADMIN.value
  const canEdit = Boolean(
    isSameUser || (roleCanManage && !isSameRole && !isTargetMasterAdmin)
  )
  const canDelete = Boolean(
    roleCanManage && !isSameUser && !isSameRole && !isTargetMasterAdmin
  )

  // Final edit mode is gated by permissions
  const isEditMode = Boolean(isEditModeQuery && canEdit)

  useEffect(() => {
    if (userId) {
      setOpen(true)
    }
  }, [userId])

  // Prevent unauthorized edit mode via URL
  useEffect(() => {
    if (!isLoading && userId && isEditModeQuery && !canEdit) {
      toast.info('You are not authorized to edit this user.', { autoClose: 3000 })
      navigate(`/portal/staffs?userId=${userId}`)
    }
  }, [isLoading, userId, isEditModeQuery, canEdit, navigate])

  const handleClose = () => {
    setOpen(false)
    navigate("/portal/staffs")
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await agent.Users.deleteUser(userId)
      toast.success('Deleted successfully.');
    } catch (error) {
      toast.error(error?.message || "Error Occured.");
    } finally {
      setLoading(false)
      setOpenDeleteDialog(false)
      handleClose()
      await mutate()
    }
  }

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    const numberOnly = input.startsWith("63") ? input.slice(2) : input;
    if (numberOnly.length <= 10) {
      formik.setFieldValue("phoneNumber", numberOnly);
    }
  };

  // Deprecated local access flags; replaced by canEdit/canDelete above

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
        <MainCard content={false}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Box component="span" fontSize={18} fontWeight={600}>
              {isEditMode ? 'Edit User' : 'User Details'}
            </Box>
            <IconButton title="Close" color="secondary" onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Box sx={{ p: 3 }}>
            {isLoading ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rounded" height={280} />
                </Grid>
                <Grid item xs={12} md={8}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} height={40} sx={{ mb: 2 }} />
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <MainCard sx={{ p: 2, textAlign: 'center' }}>
                    {isEditMode ? (
                      <Stack justifyContent='center' alignItems='center'>
                        <AvatarUpload
                          file={formik.values.avatar}
                          setFieldValue={(field, value) =>
                            formik.setFieldValue('avatar', value)
                          }
                          initialFile={formik.values.avatar}
                        />
                        {formik.values.avatar && (
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => formik.setFieldValue('avatar', '')}
                            sx={{ mt: 1 }}
                          >
                            Clear Avatar
                          </Button>
                        )}
                      </Stack>
                    ) : (
                      <Box
                        component="img"
                        src={avatar || emptyUser}
                        sx={{
                          width: '100%',
                          borderRadius: 2,
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </MainCard>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <LabeledValue
                        title="Full Name"
                        icon={<UserOutlined />}
                        subTitle={
                          isEditMode ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                              <OutlinedInput
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                              />
                              <OutlinedInput
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                              />
                            </Stack>
                          ) : (
                            <Box fontWeight={500}>
                              {firstName} {lastName}
                            </Box>
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <LabeledValue
                        title="Email Address"
                        icon={<MailOutlined />}
                        subTitle={
                          isEditMode ? (
                            <OutlinedInput
                              fullWidth
                              label="Email"
                              name="emailAddress"
                              value={formik.values.emailAddress}
                              onChange={formik.handleChange}
                            />
                          ) : (
                            <Box>{emailAddress}</Box>
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <LabeledValue
                        title="Phone Number"
                        icon={<PhoneOutlined />}
                        subTitle={
                          isEditMode ? (
                            <OutlinedInput
                              fullWidth
                              label="Phone Number"
                              name="phoneNumber"
                              value={`+63 ${formik.values.phoneNumber}`}
                              onChange={handlePhoneChange}
                              inputProps={{
                                inputMode: 'numeric',
                                maxLength: 14
                              }}
                            />
                          ) : (
                            <Box>{phoneNumber}</Box>
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <LabeledValue
                        title="Position"
                        icon={<CardAccountDetailsOutline />}
                        subTitle={
                          isEditMode ? (
                            <Select
                              fullWidth
                              name="position"
                              value={formik.values.position}
                              onChange={formik.handleChange}
                            >
                              {USER_TYPES.filter(
                                (f) => f.value !== USER_ROLES.CUSTOMER.value
                              ).map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            position?.[0]?.label
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <LabeledValue
                        title="Status"
                        icon={<CardAccountDetailsOutline />}
                        subTitle={
                          isEditMode ? (
                            <Select
                              fullWidth
                              name="status"
                              value={formik.values.status}
                              onChange={formik.handleChange}
                            >
                              {USER_STATUSSES.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {titleCase(option)}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            status
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ mt: 4 }}
            >
              {!isEditMode && canEdit && (
                <Button
                  variant="outlined"
                  startIcon={<CardAccountDetailsOutline />}
                  onClick={() =>
                    navigate(`/portal/staffs?userId=${userId}&isEditMode=true`)
                  }
                >
                  Edit
                </Button>
              )}
              {canDelete && !isEditMode && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete
                </Button>
              )}
              {isEditMode && (
                <AnimateButton>
                  <LoadingButton
                    loading={formik.isSubmitting}
                    variant="contained"
                    onClick={formik.handleSubmit}
                  >
                    Save Changes
                  </LoadingButton>
                </AnimateButton>
              )}
            </Stack>
          </Box>
        </MainCard>
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