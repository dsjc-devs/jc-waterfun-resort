import React from "react";
import MainCard from "components/MainCard";
import {
  MailOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Grid, Chip } from "@mui/material";
import { PESO_SIGN } from "constants/constants";

import LabeledValue from "components/LabeledValue";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import titleCase from "utils/titleCaseFormatter";
import formatPeso from "utils/formatPrice";
import useGetPosition from "hooks/useGetPosition";
import ConvertDate from "components/ConvertDate";
import textFormatter from "utils/textFormatter";

const Details = ({ reservationData = {} }) => {
  const { isCustomer } = useGetPosition()

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
  } = reservationData;

  const paymentsStatus = amount?.totalPaid >= amount?.total
  const paymentsStatusLabel = paymentsStatus ? 'FULLY_PAID' : (amount?.totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID')

  return (
    <React.Fragment>
      <MainCard>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainCard title="Booking Information" sx={{ marginBottom: 1 }}>
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
              </Grid>
            </MainCard>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            <MainCard title="Entrance Information" sx={{ marginBottom: 1, flex: 1, display: "flex", flexDirection: "column" }}>
              <Grid container spacing={2}>
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
              </Grid>
            </MainCard>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            <MainCard
              title="Payment Information"
              sx={{ marginBottom: 1, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Chip
                size='small'
                label={textFormatter.fromSlug(titleCase(paymentsStatusLabel))}
                color={{
                  FULLY_PAID: 'success',
                  PARTIALLY_PAID: 'primary',
                  UNPAID: 'error'
                }[paymentsStatusLabel] || 'default'}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <LabeledValue
                    title="Accommodation Total"
                    subTitle={formatPeso(amount?.accommodationTotal)}
                    icon={PESO_SIGN}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LabeledValue
                    title="Entrance Total"
                    subTitle={formatPeso(amount?.entranceTotal)}
                    icon={PESO_SIGN}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LabeledValue
                    title="Total Amount"
                    subTitle={formatPeso(amount?.total)}
                    icon={PESO_SIGN}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LabeledValue
                    title="Minimum Payable Amount"
                    subTitle={formatPeso(amount?.minimumPayable)}
                    icon={PESO_SIGN}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LabeledValue
                    title="Total Paid"
                    subTitle={formatPeso(amount?.totalPaid)}
                    icon={PESO_SIGN}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
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

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            <MainCard
              title="Accommodation Information"
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <LongAccommodationCard
                data={{ ...accommodationData, price: amount?.accommodationTotal }}
              />
            </MainCard>
          </Grid>

          {!isCustomer ? (
            // STAFF / ADMIN VIEW
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
              <MainCard
                title="Customer Information"
                sx={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
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
            </Grid>
          ) : (
            // CUSTOMER VIEW
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
              <MainCard
                title="Reservation Summary"
                sx={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LabeledValue
                      title="Reserved By"
                      subTitle={`${userData.firstName} ${userData.lastName}`}
                      icon={<UserOutlined />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LabeledValue
                      title="Contact Email"
                      subTitle={userData.emailAddress}
                      icon={<MailOutlined />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LabeledValue
                      title="Phone Number"
                      subTitle={
                        userData.phoneNumber ? `+63 ${userData.phoneNumber}` : "N/A"
                      }
                      icon={<PhoneOutlined />}
                    />
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          )}
        </Grid>
      </MainCard>
    </React.Fragment>
  );
};

export default Details;
