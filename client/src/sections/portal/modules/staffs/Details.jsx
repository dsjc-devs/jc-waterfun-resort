import React, { useEffect, useState } from 'react'
import { Box, Dialog, Grid, Skeleton, Stack, OutlinedInput, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material'
import { CloseOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { useGetSingleUser } from 'api/users'
import { CardAccountDetailsOutline } from 'mdi-material-ui'
import { USER_ROLES, USER_TYPES } from 'constants/constants'

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

const Details = ({ mutate }) => {
  const queryParams = new URLSearchParams(window.location.search)
  const userId = queryParams.get("userId")
  const isEditMode = queryParams.get('isEditMode')

  const { user: loggedInUser } = useAuth()
  const { user: viewUser, isLoading } = useGetSingleUser(userId) ?? {}
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
      position: viewUser?.position?.[0]?.value || ''
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
    position
  } = viewUser || {}

  useEffect(() => {
    if (userId) {
      setOpen(true)
    }
  }, [userId, isEditMode])

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

  const isSameRole = loggedInUser && loggedInUser?.position[0].value === viewUser?.position[0].value
  const hasAccess = !isSameRole && loggedInUser?.position[0].value === USER_TYPES[0].value

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
      >
        <MainCard>
          <Stack direction='row' alignItems='center' justifyContent='flex-end'>
            <IconButton title='Close' color='secondary' onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>

          <Box padding={2}>
            {!isLoading && hasAccess && (
              <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing={2} marginBlockEnd={1}>
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
                  <Grid item sm={12} md={4}>
                    <MainCard>
                      {isEditMode ? (
                        <MainCard title="Avatar" content={false}>
                          {formik.values.avatar && (
                            <Stack alignItems='flex-end' padding={1} >
                              <AnimateButton>
                                <Button color='error' onClick={() => formik.setFieldValue("avatar", "")}> X Clear Avatar </Button>
                              </AnimateButton>
                            </Stack>
                          )}
                          <Stack alignItems='center' padding={1}>
                            <AvatarUpload
                              file={formik.values.avatar}
                              setFieldValue={(field, value) => formik.setFieldValue('avatar', value)}
                              error={formik.touched.avatar && formik.errors.avatar}
                              initialFile={formik.values.avatar}
                            />
                          </Stack>
                        </MainCard>
                      ) : (
                        <Box
                          component='img'
                          src={avatar || emptyUser}
                          sx={{
                            width: '100%',
                            objectFit: 'cover',
                            aspectRatio: "1/1",
                            borderRadius: 4.5
                          }}
                        />
                      )}
                    </MainCard>
                  </Grid>

                  <Grid item sm={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <LabeledValue
                          title='Full Name'
                          icon={<UserOutlined />}
                          subTitle={
                            isEditMode ? (
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <OutlinedInput
                                  fullWidth
                                  name="firstName"
                                  value={formik.values.firstName}
                                  onChange={formik.handleChange}
                                  placeholder="First Name"
                                />
                                <OutlinedInput
                                  fullWidth
                                  name="lastName"
                                  value={formik.values.lastName}
                                  onChange={formik.handleChange}
                                  placeholder="Last Name"
                                />
                              </Stack>
                            ) : `${firstName} ${lastName}`
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <LabeledValue
                          title='Email Address'
                          icon={<MailOutlined />}
                          subTitle={
                            isEditMode ? (
                              <OutlinedInput
                                fullWidth
                                name="emailAddress"
                                value={formik.values.emailAddress}
                                onChange={formik.handleChange}
                                placeholder="Email Address"
                              />
                            ) : emailAddress
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <LabeledValue
                          title='Phone Number'
                          icon={<PhoneOutlined />}
                          subTitle={
                            isEditMode ? (
                              <OutlinedInput
                                fullWidth
                                name="phoneNumber"
                                type="tel"
                                value={`+63 ${formik.values.phoneNumber}`}
                                onBlur={formik.handleBlur}
                                onChange={handlePhoneChange}
                                placeholder="+63 --- --- ----"
                                inputProps={{
                                  inputMode: "numeric",
                                  maxLength: 14,
                                }}
                              />
                            ) : phoneNumber
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
                                {USER_TYPES.filter((f) => f.value !== USER_ROLES.CUSTOMER.value).map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : viewUser && position?.[0]?.label
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </MainCard>
            {(isEditMode) && (
              <Stack direction='row' justifyContent='flex-end' marginTop={2}>
                <AnimateButton>
                  <LoadingButton
                    loading={formik.isSubmitting}
                    disableElevation
                    disabled={formik.isSubmitting}
                    loadingPosition="start"
                    fullWidth
                    onClick={formik.handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ width: "150px" }}
                  >
                    Save
                  </LoadingButton>
                </AnimateButton>
              </Stack>
            )}
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