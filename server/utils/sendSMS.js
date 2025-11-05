import axios from "axios";

// Skycode SMS sender
export async function sendSMS({ number, message }) {
  if (!number || !message) throw new Error("sendSMS: 'number' and 'message' are required");

  const url = "https://sms.skyio.site/api/sms/send";
  const apiKey = process.env.SKYCODE_API_KEY;

  if (!apiKey) throw new Error("SKYCODE_API_KEY is not configured");

  // Normalize PH numbers (e.g., 09xxxxxxxxx -> 639xxxxxxxxx)
  const normalizeNumber = (num) => {
    const s = String(num).trim();
    if (s.startsWith("0") && s.length === 11) return `63${s.slice(1)}`;
    return s;
  };

  const to = normalizeNumber(number);

  try {
    const response = await axios.post(
      url,
      { to, message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        timeout: 10000
      }
    );

    console.log("SMS Sent (Skycode):", response.data);
    return response.data;
  } catch (error) {
    console.error("SMS Error (Skycode):", error.response?.data || error.message);
    throw error;
  }
}
