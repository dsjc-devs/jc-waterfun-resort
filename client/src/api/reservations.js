import axiosServices, { fetcher } from 'utils/axios'
import { useMemo } from "react";
import { OPTIONS } from "constants/constants";

import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/reservations`,
};

export const useGetReservations = (queryObj = {}) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const apiURL = queryParams && `/${endpoints.key}?${queryParams}`;

  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

export const useGetSingleReservation = (reservationId) => {
  const apiURL = reservationId && `/${endpoints.key}/${reservationId}`;

  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const Reservations = {
  createReservation: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editReservation: async (reservationId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${reservationId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteReservation: async (reservationId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${reservationId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
}

export default {
  Reservations
}
