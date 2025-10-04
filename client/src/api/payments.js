import axiosServices from "utils/axios";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/payments`,
};

const Payments = {
  createPayment: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/pay-with-gcash`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  payWithGCash: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/pay-with-gcash`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  payWithMaya: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/pay-with-maya`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  payWithBankTransfer: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/pay-with-bank-transfer`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  payWithMethod: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/pay-with-method`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  createPaymentWithBooking: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/create-payment-with-booking`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.error);
    }
  },
}

export default {
  Payments
}