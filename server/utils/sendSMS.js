import axios from "axios";

export async function sendSMS({ number, message, sendername = "JCEZARRESORT" }) {
  const url = "https://api.semaphore.co/api/v4/messages";

  const params = {
    apikey: process.env.SEMAPHORE_API_KEY,
    number,
    message,
    sendername,
  };

  try {
    const response = await axios.post(url, params);
    console.log("SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw error;
  }
}
