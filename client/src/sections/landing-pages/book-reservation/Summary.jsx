import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import MainCard from "components/MainCard";
import useAuth from "hooks/useAuth";

const Summary = ({ bookingInfo, onConfirm, onBack }) => {
  const { user } = useAuth()

  const { guests, includeEntrance, total } =
    bookingInfo;

  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    date,
  } = user || {}

  const name = `${firstName} ${lastName}`


  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Booking Summary
      </Typography>

      <MainCard style={{ borderRadius: "12px", boxShadow: "1em", marginBlockEnd: "1em" }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          <ListItem>
            <ListItemText primary="Name" secondary={name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={emailAddress} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone" secondary={phoneNumber} />
          </ListItem>
        </List>
      </MainCard>

      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Booking Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            <ListItem>
              <ListItemText primary="Date" secondary={date} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Guests" secondary={guests} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Entrance Fee Included"
                secondary={includeEntrance ? "Yes" : "No"}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong>Total: </strong>₱{total?.toLocaleString() || 0}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Confirm Booking
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Summary;
