const changePasswordNotification = (userData) => {
  const {
    firstName,
    lastName,
    emailAddress
  } = userData;

  const userName = `${firstName || ""} ${lastName || ""}`.trim();
  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
    <h2 style="color:#0288d1; margin:0 0 20px; font-family:Arial, sans-serif;">
      🔒 Password Changed Successfully
    </h2>
    <p style="font-size:15px;">Hi <b>${userName}</b>,</p>
    <p style="font-size:15px;">
      Your password for <b>${emailAddress}</b> has been changed.<br>
      If you did not request this change, please contact our support team immediately.
    </p>
    <table cellpadding="12" cellspacing="0" border="0"
      style="margin:20px 0; font-size:14px; color:#333; border-collapse:collapse; width:100%; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      <tr style="background-color:#e1f5fe;">
        <td><b>Name</b></td>
        <td>${userName}</td>
      </tr>
      <tr>
        <td><b>Email</b></td>
        <td>${emailAddress}</td>
      </tr>
      <tr style="background-color:#e1f5fe;">
        <td><b>Change Date</b></td>
        <td>${formattedDate}</td>
      </tr>
    </table>
    <p style="margin-top:20px; font-size:15px;">
      For your security, always keep your password confidential.<br>
      If you have any questions, our team is here to help.
    </p>
  `;
};

export default changePasswordNotification;
