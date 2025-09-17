import axios from 'axios';
import Payment from '../models/paymentModels.js';

const createPaymentIntent = async (data) => {
  const { amount } = data || {};
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_intents",
      {
        data: {
          attributes: {
            amount,
            currency: "PHP",
            payment_method_allowed: ["gcash"],
            capture_type: "automatic"
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.errors?.[0]?.detail || error.message);
  }
};

const createGCashPaymentMethod = async (data) => {
  const { name, email, phone, returnUrl } = data;

  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_methods",
      {
        data: {
          attributes: {
            type: "gcash",
            billing: { name, email, phone },
            redirect: {
              return_url: returnUrl
            }
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to create GCash payment method");
  }
};

const attachPaymentMethod = async (paymentIntentId, paymentMethodId, returnUrl) => {
  try {
    const response = await axios.post(
      `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
      {
        data: {
          attributes: {
            payment_method: paymentMethodId,
            return_url: returnUrl
          }
        }
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to attach GCash payment method");
  }
};

const createPaymentDB = async (paymentData) => {
  try {
    const payment = await Payment.create(paymentData);
    return payment;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to create payment record");
  }
}

export default {
  createPaymentIntent,
  createGCashPaymentMethod,
  attachPaymentMethod,
  createPaymentDB
};
