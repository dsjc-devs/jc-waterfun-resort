// sections/portal/modules/customers/Details.jsx
import React from 'react';
import { CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import MainCard from 'components/MainCard';
import ConvertDate from 'components/ConvertDate';
import LabeledValue from 'components/LabeledValue';
import { BookOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, MailOutlined, PhoneOutlined, PictureOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';

const Details = ({ user, isLoading }) => {
  if (isLoading || !user) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 5 }}>
        <CircularProgress />
      </Grid>
    );
  }

  const {
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    position,
    avatar,
    createdAt,
  } = user;

  const totalReservations = 18;
  const upcomingReservations = 5;
  const pastReservations = 13;
  const lastReservationDate = '2025-08-06T14:30:00Z';
  const mostFrequentService = 'Cottage Rental';

  return (
    <Grid container spacing={2} alignItems='stretch'>
      <Grid item sm={12} md={6} sx={{ display: 'flex' }}>
        <MainCard title="Profile Information">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<UserOutlined />}
                title="Full Name"
                subTitle={`${firstName} ${lastName}`}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<MailOutlined />}
                title="Email Address"
                subTitle={emailAddress}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<PhoneOutlined />}
                title="Mobile Number"
                subTitle={mobileNumber || 'N/A'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<CalendarOutlined />}
                title="Account Created"
                subTitle={<ConvertDate dateString={createdAt} time />}
              />
            </Grid>

            {avatar && (
              <Grid item xs={12}>
                <LabeledValue
                  icon={<PictureOutlined />}
                  title="Avatar"
                  subTitle={
                    <img
                      src={avatar}
                      alt={`${firstName} ${lastName}`}
                      style={{ width: 100, height: 100, borderRadius: '50%' }}
                    />
                  }
                />
              </Grid>
            )}
          </Grid>
        </MainCard>
      </Grid>

      <Grid item sm={12} md={6} sx={{ display: 'flex' }}>
        <MainCard title="Reservation Summary">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<BookOutlined />}
                title="Total Reservations"
                subTitle={totalReservations ?? 'No Data'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<ClockCircleOutlined />}
                title="Upcoming Reservations"
                subTitle={upcomingReservations ?? 'No Data'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<CheckCircleOutlined />}
                title="Past Reservations"
                subTitle={pastReservations ?? 'No Data'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LabeledValue
                icon={<CalendarOutlined />}
                title="Last Reservation"
                subTitle={
                  lastReservationDate ? (
                    <ConvertDate dateString={lastReservationDate} time />
                  ) : (
                    'No Reservation'
                  )
                }
              />
            </Grid>

            <Grid item xs={12}>
              <LabeledValue
                icon={<TagOutlined />}
                title="Most Frequent Service"
                subTitle={mostFrequentService || 'No Frequent Service'}
              />
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Details;
