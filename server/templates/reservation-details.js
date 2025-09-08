const reservationDetails = (reservationData) => {
  const {
    reservationId,
    userData,
    startDate,
    endDate,
    guests,
    status,
    amount,
    accommodationId
  } = reservationData;

  const guestName = `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim();
  const formattedStartDate = new Date(startDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const formattedEndDate = new Date(endDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
    <h2 style="color:#0288d1; margin:0 0 20px; font-family:Arial, sans-serif;">
      🌊 Your Reservation Details
    </h2>
    <p style="font-size:15px;">Hi <b>${guestName}</b>,</p>
    <p style="font-size:15px;">We’re thrilled to welcome you to <b>John Cezar Waterfun Resort</b>!  
      Here are your booking details:</p>

    <table cellpadding="12" cellspacing="0" border="0" 
      style="margin:20px 0; font-size:14px; color:#333; border-collapse:collapse; width:100%; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      
      <tr style="background-color:#e1f5fe;">
        <td><b>Reservation ID</b></td>
        <td>${reservationId}</td>
      </tr>
      <tr>
        <td><b>Check-in</b></td>
        <td>${formattedStartDate}</td>
      </tr>
      <tr style="background-color:#e1f5fe;">
        <td><b>Check-out</b></td>
        <td>${formattedEndDate}</td>
      </tr>
      <tr>
        <td><b>Guests</b></td>
        <td>${guests}</td>
      </tr>
      <tr style="background-color:#e1f5fe;">
        <td><b>Accommodation</b></td>
        <td>${accommodationId}</td>
      </tr>
      <tr>
        <td><b>Status</b></td>
        <td style="color:${status === "CONFIRMED" ? "#2e7d32" : "#c62828"};">
          ${status}
        </td>
      </tr>
      <tr style="background-color:#e1f5fe;">
        <td><b>Total Amount</b></td>
        <td>₱${amount?.total?.toLocaleString() || 0}</td>
      </tr>
      <tr>
        <td><b>Paid</b></td>
        <td>₱${amount?.totalPaid?.toLocaleString() || 0}</td>
      </tr>
      <tr style="background-color:#e1f5fe;">
        <td><b>Balance</b></td>
        <td>₱${((amount?.total || 0) - (amount?.totalPaid || 0)).toLocaleString()}</td>
      </tr>
    </table>

    <p style="margin-top:20px; font-size:15px;">
      🌴 Pack your bags and get ready for an unforgettable time!  
      If you have any questions, our team is just a call away.
    </p>
  `;
};

export default reservationDetails;
