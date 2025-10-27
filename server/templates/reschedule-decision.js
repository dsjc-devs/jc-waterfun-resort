const rescheduleDecision = ({
  reservationId,
  guestName = 'Guest',
  accommodationData = {},
  oldStartDate,
  oldEndDate,
  newStartDate,
  newEndDate,
  decision = 'APPROVED',
  reason
}) => {
  const formatDate = (d) => new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const approved = decision === 'APPROVED';

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="margin:0 0 12px;">Reschedule ${approved ? 'Approved' : 'Rejected'}</h2>
      <p>Hi ${guestName},</p>
      ${approved
      ? `<p>Your request to reschedule reservation <strong>${reservationId}</strong> for <strong>${accommodationData?.name || 'your accommodation'}</strong> has been <strong>approved</strong>.</p>`
      : `<p>Your request to reschedule reservation <strong>${reservationId}</strong> for <strong>${accommodationData?.name || 'your accommodation'}</strong> has been <strong>rejected</strong>.</p>`}

      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tbody>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #eee;">Original Dates</td>
            <td style="padding: 6px 8px; border: 1px solid #eee;"><strong>${formatDate(oldStartDate)} - ${formatDate(oldEndDate)}</strong></td>
          </tr>
          ${approved ? `
          <tr>
            <td style="padding: 6px 8px; border: 1px solid #eee;">New Confirmed Dates</td>
            <td style="padding: 6px 8px; border: 1px solid #eee;"><strong>${formatDate(newStartDate)} - ${formatDate(newEndDate)}</strong></td>
          </tr>` : ''}
        </tbody>
      </table>

      ${!approved && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

      <p>Thank you,<br/>John Cezar Waterfun Resort</p>
    </div>
  `;
};

export default rescheduleDecision;
