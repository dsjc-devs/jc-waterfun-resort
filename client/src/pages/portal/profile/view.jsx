import React from 'react'
import { EditOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useGetSingleUser } from 'api/users'
import { useNavigate } from 'react-router'
import LabeledValue from 'components/LabeledValue'
import MainCard from 'components/MainCard'
import useAuth from 'hooks/useAuth'
import emptyUser from 'assets/images/users/empty-user.png'
import AnimateButton from 'components/@extended/AnimateButton'

const ViewProfile = () => {
  const { user: loggedInUser } = useAuth();
  const { user } = useGetSingleUser(loggedInUser?.userId)

  const navigate = useNavigate()

  const theme = useTheme()

  const {
    avatar,
    userId,
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    position
  } = user || {}

  return (
    <React.Fragment>
      <Stack direction='flex' justifyContent='flex-end' spacing={2} marginBlock={1}>
        <AnimateButton>
          <Button variant='contained' onClick={() => navigate('/portal/profile/edit')} color='info' startIcon={<EditOutlined />}> Edit </Button>
        </AnimateButton>
      </Stack>
      <MainCard>
        <Grid container justifyContent='center' spacing={2} >
          <Grid item xs={12} sm={12} md={3} >
            <MainCard>
              <Stack alignItems='center'>
                <Box mb={3}>
                  <img
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px',
                      borderStyle: 'dotted',
                      borderColor: theme.palette.primary.main
                    }}
                    src={avatar || emptyUser}
                    alt="Profile"
                  />
                </Box>
                <Typography mb={1} variant='h5'>{firstName} {lastName}</Typography>
                <Typography variant='subtitle2' color='secondary'> {position[0]?.label} </Typography>
              </Stack>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={12} md={9}   >
            <MainCard style={{ minHeight: '70dvh' }}>
              <Typography variant='h4'>Personal Information</Typography>
              <Divider sx={{ marginBlock: 2 }} />
              <Box>
                <LabeledValue
                  title='User ID'
                  subTitle={userId}
                  icon={<IdcardOutlined />}
                />
              </Box>
              <Grid container my={3}>
                <Grid item md={12}>
                  <LabeledValue
                    title='Full Name'
                    subTitle={`${firstName} ${lastName}`}
                    icon={<UserOutlined />}
                  />
                </Grid>
              </Grid>
              <Grid container my={3}>
                <Grid item md={6}>
                  <LabeledValue
                    title='Email Address'
                    subTitle={emailAddress}
                    icon={<MailOutlined />}
                  />
                </Grid>
                <Grid item md={6}>
                  <LabeledValue
                    title='Mobile Number'
                    subTitle={phoneNumber}
                    icon={<PhoneOutlined />}
                  />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </MainCard>
    </React.Fragment>
  )
}

export default ViewProfile