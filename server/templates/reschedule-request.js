const rescheduleRequest = ({ reservationId, guestName = 'Guest', accommodationData = {}, oldStartDate, oldEndDate, newStartDate, newEndDate }) => {
  const formatDate = (d) => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="margin:0 0 12px;">Reschedule Request Received</h2>
      <p>Hi ${guestName},</p>
      <p>We received your request to reschedule your reservation <strong>${reservationId}</strong> for <strong>${accommodationData?.name || 'your accommodation'}</strong>.</p>

      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tbody>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #eee;">Current Dates</td>
            <td style="padding: 6px 8px; border: 1px solid #eee;"><strong>${formatDate(oldStartDate)} - ${formatDate(oldEndDate)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #eee;">Requested New Dates</td>
            <td style="padding: 6px 8px; border: 1px solid #eee;"><strong>${formatDate(newStartDate)} - ${formatDate(newEndDate)}</strong></td>
          </tr>
        </tbody>
      </table>

      <p><em>This request is subject to staff confirmation and availability.</em> We'll notify you once it's approved or if we need adjustments.</p>
      <p>Thank you,<br/>John Cezar Waterfun Resort</p>
    </div>
  `;
};

export default rescheduleRequest;
