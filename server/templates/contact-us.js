const createMessageRow = (label, value) => {
  return `
    <tr>
      <td style="padding: 10px 15px; vertical-align: top; width: 140px; font-weight: 600; color: #1565c0; background: rgba(21,101,192,0.05);">${label}</td>
      <td style="padding: 10px 15px; color: #37474f; background: rgba(21,101,192,0.02);">${value || '<em>Not provided</em>'}</td>
    </tr>
  `
}

export const contactNotificationTemplate = (contactData = {}) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    subject,
    remarks
  } = contactData

  const guestName = [firstName, lastName].filter(Boolean).join(' ')

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif;">
      <tr>
        <td style="padding: 5px 15px 20px 15px; font-size: 16px; color: #0d47a1;">
          You have a new inquiry from <strong>${guestName || 'a guest'}</strong>.
        </td>
      </tr>
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(25,118,210,0.18); box-shadow: 0 4px 16px rgba(13,71,161,0.08);">
            ${createMessageRow('Guest Name', guestName || '—')}
            ${createMessageRow('Email Address', emailAddress)}
            ${createMessageRow('Mobile Number', phoneNumber)}
            ${createMessageRow('Subject', subject)}
            ${createMessageRow('Message', remarks)}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 18px 15px 0 15px; color: #546e7a; font-size: 14px;">
          Take a moment to reach out and craft a memorable stay for our guest.
        </td>
      </tr>
    </table>
  `
}

export const contactAcknowledgementTemplate = (contactData = {}) => {
  const { firstName, subject } = contactData

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif;">
      <tr>
        <td style="padding: 5px 15px 15px 15px; color: #0d47a1; font-size: 16px;">
          Hi ${firstName || 'Guest'},
        </td>
      </tr>
      <tr>
        <td style="padding: 0 15px 15px 15px; color: #37474f; font-size: 15px; line-height: 1.6;">
          Thanks for getting in touch about <strong>${subject || 'your upcoming getaway'}</strong>. Our team is reviewing your message and will respond within the next 24 hours with the information you need.
        </td>
      </tr>
      <tr>
        <td style="padding: 0 15px 15px 15px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(21,101,192,0.15); background: rgba(187,222,251,0.2);">
            <tr>
              <td style="padding: 14px 18px; color: #1565c0; font-size: 14px; font-weight: 600;">
                Need immediate assistance?
              </td>
            </tr>
            <tr>
              <td style="padding: 0 18px 18px 18px; color: #455a64; font-size: 14px; line-height: 1.6;">
                Give us a call or chat with us on Facebook so we can help you lock in your preferred dates sooner.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 15px 15px 15px; color: #546e7a; font-size: 14px;">
          Talk soon,<br/>
          <strong>John Cezar Waterfun Resort Team</strong>
        </td>
      </tr>
    </table>
  `
}
