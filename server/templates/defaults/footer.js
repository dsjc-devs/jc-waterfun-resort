const footer = (name, address, emailAddress, phoneNumber) => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" 
      style="background-color:#0288d1; padding:20px; text-align:center; font-size:13px; color:#ffffff;">
      <tr>
        <td>
          <p style="margin:0; font-weight:bold;">${name}</p>
          <p style="margin:5px 0;">📍 ${address}</p>
          <p style="margin:5px 0;">📧 ${emailAddress} | ☎ ${phoneNumber}</p>
          <p style="margin:15px 0 0 0; font-size:12px; color:#bbdefb;">
            This is an automated email. Please do not reply.
          </p>
        </td>
      </tr>
    </table>
  `;
};

export default footer;
