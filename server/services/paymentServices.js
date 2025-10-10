import axios from 'axios';
import Payment from '../models/paymentModels.js';

const getPaymongoSecretKey = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? process.env.PAYMONGO_SECRET_KEY_LIVE : process.env.PAYMONGO_SECRET_KEY_TEST;
};

const authHeader = () => ({
  Authorization: `Basic ${Buffer.from(getPaymongoSecretKey() + ':').toString('base64')}`,
  'Content-Type': 'application/json',
});

const createPaymentIntent = async (data) => {
  const { amount, paymentMethods = ["gcash"] } = data || {};
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_intents",
      {
        data: {
          attributes: {
            amount,
            currency: "PHP",
            payment_method_allowed: paymentMethods,
            capture_type: "automatic"
          },
        },
      },
      { headers: authHeader() }
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
      { headers: authHeader() }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to create GCash payment method");
  }
};

const createMayaPaymentMethod = async (data) => {
  const { name, email, phone, returnUrl } = data;

  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_methods",
      {
        data: {
          attributes: {
            type: "paymaya",
            billing: { name, email, phone },
            redirect: {
              return_url: returnUrl
            }
          }
        }
      },
      { headers: authHeader() }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to create Maya payment method");
  }
};

const createPaymentMethod = async (data) => {
  const { paymentType, name, email, phone, returnUrl } = data;

  const paymentTypeMap = {
    'gcash': 'gcash',
    'maya': 'paymaya',
    'bank-transfer': 'dob' // Direct Online Banking for bank transfers
  };

  const paymongoType = paymentTypeMap[paymentType];
  if (!paymongoType) {
    throw new Error(`Unsupported payment type: ${paymentType}`);
  }

  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_methods",
      {
        data: {
          attributes: {
            type: paymongoType,
            billing: { name, email, phone },
            redirect: {
              return_url: returnUrl
            }
          }
        }
      },
      { headers: authHeader() }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || `Failed to create ${paymentType} payment method`);
  }
};

const createBankTransferPaymentMethod = async (data) => {
  const { name, email, phone, returnUrl } = data;

  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_methods",
      {
        data: {
          attributes: {
            type: "dob", // Direct Online Banking for bank transfers
            billing: { name, email, phone },
            redirect: {
              return_url: returnUrl
            }
          }
        }
      },
      { headers: authHeader() }
    );

    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.detail || "Failed to create Bank Transfer payment method");
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
      { headers: authHeader() }
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
  createMayaPaymentMethod,
  createBankTransferPaymentMethod,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentDB
};
