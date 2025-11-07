import axiosServices, { fetcher } from 'utils/axios';
import { useMemo } from 'react';
import { OPTIONS } from 'constants/constants';
import useSWR from 'swr';

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/blocked-dates`
};

export const useGetBlockedDates = (queryObj = {}) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const apiURL = `/${endpoints.key}?${queryParams}`;
  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);
  return useMemo(() => ({ data, isLoading, error, mutate }), [data, isLoading, error, mutate]);
};

export const useGetSingleBlockedDate = (blockedDateId) => {
  const apiURL = blockedDateId && `/${endpoints.key}/${blockedDateId}`;
  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);
  return useMemo(() => ({ data, isLoading, error, mutate }), [data, isLoading, error, mutate]);
};

const BlockedDates = {
  createBlockedDate: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editBlockedDate: async (blockedDateId, payload) => {
    try {
      const response = await axiosServices.put(`/${endpoints.key}/${blockedDateId}`, payload);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteBlockedDate: async (blockedDateId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${blockedDateId}`);
      return response;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
};

export default { BlockedDates };
