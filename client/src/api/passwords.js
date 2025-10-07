import axiosServices from "utils/axios";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/password`,
};

const Password = {
  changePassword: async (id, data) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/change-password`, data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  Password
}