import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  Stack,
  Divider,
} from "@mui/material";
import { IdcardOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";

import MainCard from "components/MainCard";
import useAuth from "hooks/useAuth";
import LabeledValue from "components/LabeledValue";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import PaymentSummaryCard from "components/accommodations/PaymentSummaryCard";
import titleCase from "utils/titleCaseFormatter";

const Summary = ({ bookingInfo }) => {
  const { user } = useAuth();

  const { accommodationData, amount, entrances, startDate, endDate, includeEntranceFee, mode, guests } = bookingInfo || {};

  const capacity = accommodationData?.capacity || 0;
  const extraPersonFeeValue = accommodationData?.extraPersonFee || 0;
  const usedGuests = typeof guests === 'number' ? guests : (entrances.adult + entrances.child + entrances.pwdSenior);
  const extraPersonFee = (extraPersonFeeValue > 0 && usedGuests > capacity)
    ? (usedGuests - capacity) * extraPersonFeeValue
    : 0;
  const { firstName, lastName, emailAddress, phoneNumber, userId } = user || {};

  const customer_name = `${firstName || ""} ${lastName || ""}`;

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Your changes won't be saved.";
    };

    const handleUnload = () => {
      sessionStorage.removeItem("bookingData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <Box marginBlock={2}>
      <MainCard title="Customer Information">
        <Grid container spacing={2}>
          <Grid item sm={12} md={12}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={6}>
                <LabeledValue
                  ellipsis
                  title='Name'
                  subTitle={customer_name}
                  icon={<UserOutlined />}
                />
              </Grid>

              <Grid item sm={12} md={6}>
                <LabeledValue
                  ellipsis
                  title='User ID'
                  subTitle={userId}
                  icon={<IdcardOutlined />}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item sm={12} md={12}>
            <Grid container spacing={2}>
              <Grid item sm={12} md={6}>
                <LabeledValue
                  ellipsis
                  title='Email Address'
                  subTitle={emailAddress}
                  icon={<MailOutlined />}
                />
              </Grid>

              <Grid item sm={12} md={6}>
                <LabeledValue
                  ellipsis
                  title='Phone Number'
                  subTitle={`+63 ${phoneNumber}`}
                  icon={<UserOutlined />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MainCard>

      <MainCard title="Booking Details" sx={{ mt: 2 }}>
        <MainCard title="Accommodations" style={{ marginBlockEnd: '1em' }} >
          <MainCard content={false} style={{ marginBlockEnd: '1em', padding: '1em' }}>
            <LongAccommodationCard
              data={{
                ...accommodationData,
                price: amount.accommodationTotal,
                isDayMode: mode === 'day',
                startDate,
                endDate
              }}
            />
            <Box sx={{ mt: 2 }}>
              <LabeledValue
                title="Total Guests"
                subTitle={typeof guests === 'number' ? guests : (entrances.adult + entrances.child + entrances.pwdSenior)}
              />
            </Box>
          </MainCard>
        </MainCard>

        <MainCard title="Entrance Tickets" sx={{ mb: 2 }}>
          <List disablePadding>
            {["adult", "child", "pwdSenior"].map((type, idx) => {
              const qty = entrances[type] || 0;

              return (
                <React.Fragment key={type}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {idx !== 2 ? titleCase(type) : "PWD/Senior"}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography
                        variant="body1"
                        color={qty === 0 ? "text.secondary" : "text.primary"}
                      >
                        {qty} {qty === 1 ? "ticket" : "tickets"}
                      </Typography>
                    </Stack>
                  </ListItem>

                  {idx < 2 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </MainCard>
      </MainCard>
    </Box>
  );
};

export default Summary;
