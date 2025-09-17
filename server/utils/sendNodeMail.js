import nodemailer from 'nodemailer';

async function sendEmail(email, subject, content, attachments = [], bcc = []) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_CONFIGS_EMAIL,
      pass: process.env.MAIL_CONFIGS_PASSWORD
    }
  });

  let from = `John Cezar Waterfun Resort <johncezar.waterfun@gmail.com`;

  const mailConfigs = {
    from,
    to: email,
    subject,
    html: content,
    attachments,
    bcc
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailConfigs, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: 'An error encountered.' });
      }

      return resolve({ message: 'Email has been sent.', info });
    });
  });
}

export default sendEmail;
