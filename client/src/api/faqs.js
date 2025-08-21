import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/faqs`,
};

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onSuccess: (data, key, config) => data
};

export const useGetFAQS = () => {
  const key = `/${endpoints.key}`;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, options);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const FAQS = {
   addFAQ: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editFAQ: async (faqId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${faqId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteFAQ: async (faqId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${faqId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  FAQS
}