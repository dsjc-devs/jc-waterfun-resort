import axios from 'axios';

const verifyRecaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY is not configured. Skipping captcha verification.');
    return true;
  }

  if (!token) {
    throw new Error('Captcha verification failed. Please try again.');
  }

  try {
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret,
        response: token
      }
    });

    if (!data?.success) {
      throw new Error('Captcha verification failed. Please try again.');
    }

    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error?.response?.data || error?.message || error);
    throw new Error('Unable to verify captcha at the moment.');
  }
};

export default verifyRecaptcha;
