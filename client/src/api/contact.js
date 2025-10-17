import axiosServices from 'utils/axios'

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/contact`
}

const ContactUs = {
  submitContact: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response?.data
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to submit contact request.'
      throw new Error(message)
    }
  }
}

export default {
  ContactUs
}
