import axios from "axios";

export async function sendSMS({ number, message, sendername = "SEMAPHORE" }) {
  const url = "https://api.semaphore.co/api/v4/messages";

  const params = new URLSearchParams({
    apikey: process.env.SEMAPHORE_API_KEY,
    number,
    message,
    sendername,
  });

  try {
    const response = await axios.post(url, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw error;
  }
}
