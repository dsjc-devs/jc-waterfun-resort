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
}

export default {
  Payments
}