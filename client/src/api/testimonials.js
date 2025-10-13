import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/testimonials`,
};

export const useGetTestimonials = (queryObj = {}) => {
  const qs = new URLSearchParams(queryObj).toString();
  const key = qs ? `/${endpoints.key}?${qs}` : `/${endpoints.key}`;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);
  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);
  return memoizedValue;
};
const TESTIMONIALS = {
  addTestimonial: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/create`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editTestimonial: async (testimonialId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${testimonialId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteTestimonial: async (testimonialId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${testimonialId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}
export default {
  TESTIMONIALS
}