import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/users`,
};

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  onSuccess: (data, key, config) => data
};

export const useGetUsers = ({ queryObj = {} }) => {
  const queryParams = new URLSearchParams(queryObj).toString();
  const key = `/${endpoints.key}?${queryParams}`;

  const { data, isLoading, error, mutate } = useSWR(key, fetcher, options);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

export const useGetSingleUser = (userId) => {
  const { data, isLoading, error, mutate } = useSWR(
    userId ? `/${endpoints.key}/${userId}` : null,
    fetcher,
    options
  );

  const memoizedValue = useMemo(
    () => ({
      user: data,
      isLoading,
      mutate,
      error
    }),

    [data, error, isLoading, mutate]
  );

  return memoizedValue
}

const Users = {
  addUsers: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/create`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editUser: async (userId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${userId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${userId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  Users
}

