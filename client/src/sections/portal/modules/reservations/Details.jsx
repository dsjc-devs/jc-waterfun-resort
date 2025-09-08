import React from "react";
import MainCard from "components/MainCard";
import {
  MailOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  PhoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Grid, Chip, Stack, Button } from "@mui/material";
import { PESO_SIGN } from "constants/constants";
import { useNavigate } from "react-router";

import LabeledValue from "components/LabeledValue";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import titleCase from "utils/titleCaseFormatter";
import formatPeso from "utils/formatPrice";
import useGetPosition from "hooks/useGetPosition";
import ConvertDate from "components/ConvertDate";
import textFormatter from "utils/textFormatter";
import AnimateButton from "components/@extended/AnimateButton";

const Details = ({ reservationData = {} }) => {
  const { isCustomer } = useGetPosition()

  const navigate = useNavigate()

  if (!reservationData || !reservationData.userData) return null;

  const {
    userData,
    accommodationData,
    reservationId,
    startDate,
    endDate,
    status,
    entrances,
    amount,
    guests
  } = reservationData;

  const paymentsStatus = amount?.totalPaid >= amount?.total
  const paymentsStatusLabel = paymentsStatus ? 'FULLY_PAID' : (amount?.totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID')

  return (
    <React.Fragment>
      {!isCustomer && (
        <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={2}>
          <AnimateButton>
            <Button
              variant='contained'
              color='info'
              startIcon={<EditOutlined />}
              onClick={() => navigate(`/portal/reservations/form?isEditMode=true&reservationId=${reservationId}`)}
            >
              Edit
            </Button>
          </AnimateButton>
        </Stack>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MainCard>
            <MainCard title="Booking Information" sx={{ marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LabeledValue
                    ellipsis={true}
                    title="Reservation ID"
                    subTitle={reservationId}
                    icon={<IdcardOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Status"
                    subTitle={
                      <Chip
                        size="small"
                        label={titleCase(status)}
                        color={
                          {
                            PENDING: "warning",
                            CONFIRMED: "primary",
                            COMPLETED: "success",
                            RESCHEDULED: "info",
                            ARCHIVED: "error",
                          }[status] || "default"
                        }
                      />
                    }
                    icon={<IdcardOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Start Date"
                    subTitle={<ConvertDate dateString={startDate} time />}
                    icon={<CalendarOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="End Date"
                    subTitle={<ConvertDate dateString={endDate} time />}
                    icon={<CalendarOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Guests"
                    subTitle={`${guests} Guest${guests > 1 ? 's' : ''}`}
                    icon={<UserOutlined />}
                  />
                </Grid>
              </Grid>
            </MainCard>

            <MainCard title="Accommodation Information" sx={{ marginBottom: 2 }}>
              <LongAccommodationCard
                data={{ ...accommodationData, price: amount?.accommodationTotal }}
              />
            </MainCard>

            <MainCard title="Entrance Information" sx={{ marginBottom: 2 }}>
              <Grid container spacing={2}>
                {(!entrances?.adult && !entrances?.child && !entrances?.pwdSenior) ? (
                  <Grid item xs={12}>
                    <LabeledValue
                      title="No Entrance Tickets availed"
                      subTitle={"-"}
                      icon={<UserOutlined />}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="Adults"
                        subTitle={`${entrances?.adult || 0} (${formatPeso(
                          amount?.adult
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="Children"
                        subTitle={`${entrances?.child || 0} (${formatPeso(
                          amount?.child
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="PWD / Senior"
                        subTitle={`${entrances?.pwdSenior || 0} (${formatPeso(
                          amount?.pwdSenior
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </MainCard>

            {!isCustomer && (
              <MainCard title="Customer Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Full Name"
                      subTitle={`${userData.firstName} ${userData.lastName}`}
                      icon={<UserOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="User ID"
                      subTitle={userData.userId}
                      icon={<IdcardOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Email Address"
                      subTitle={userData.emailAddress}
                      icon={<MailOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Phone Number"
                      subTitle={
                        userData.phoneNumber ? `+63 ${userData.phoneNumber}` : "N/A"
                      }
                      icon={<PhoneOutlined />}
                    />
                  </Grid>
                </Grid>
              </MainCard>
            )}
          </MainCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MainCard
            title="Payment Information"
            sx={{ marginBottom: 1, flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Chip
              size='small'
              sx={{ width: '100%' }}
              label={textFormatter.fromSlug(titleCase(paymentsStatusLabel))}
              color={{
                FULLY_PAID: 'success',
                PARTIALLY_PAID: 'primary',
                UNPAID: 'error'
              }[paymentsStatusLabel] || 'default'}
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LabeledValue
                  title="Accommodation Total"
                  subTitle={formatPeso(amount?.accommodationTotal)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Entrance Total"
                  subTitle={formatPeso(amount?.entranceTotal)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Total Amount"
                  subTitle={formatPeso(amount?.total)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Extra Person Fee"
                  subTitle={formatPeso(amount?.extraPersonFee)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Minimum Payable Amount"
                  subTitle={formatPeso(amount?.minimumPayable)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Total Paid"
                  subTitle={formatPeso(amount?.totalPaid)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Balance"
                  subTitle={formatPeso((amount?.total || 0) - (amount?.totalPaid || 0))}
                  icon={PESO_SIGN}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Details;
