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

  const { accommodationData, amount, quantities, startDate, endDate, includeEntranceFee, mode } = bookingInfo || {};
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
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
              </MainCard>
            </MainCard>

            <MainCard title="Entrance Tickets" sx={{ mb: 2 }}>
              <List disablePadding>
                {["adult", "child", "pwdSenior"].map((type, idx) => {
                  const qty = quantities[type] || 0;

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
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <PaymentSummaryCard
              data={{
                accomName: accommodationData?.name,
                accomPrice: amount?.accommodationTotal,
                includeEntrance: includeEntranceFee || accommodationData?.hasPoolAccess,
                quantities: quantities,
                entranceTotal: amount?.entranceTotal,
                minimumPayable: amount?.minimumPayable,
                total: amount?.total,
                prices: {
                  adult: amount.adult,
                  child: amount.child,
                  pwdSenior: amount.pwdSenior
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
