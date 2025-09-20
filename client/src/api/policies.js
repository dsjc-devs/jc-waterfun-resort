import { OPTIONS } from "constants/constants";
import { useMemo } from "react";
import axiosServices, { fetcher } from "utils/axios";

import useSWR from "swr";
import { id } from "date-fns/locale";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/policies`,
};

export const useGetPolicies = () => {
  const { data, isLoading, error, mutate } = useSWR(`/${endpoints.key}`, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

export const useGetSinglePolicy = ({ id }) => {
  const { data, isLoading, error, mutate } = useSWR(id && `/${endpoints.key}/${id}`, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data: data?.data || {},
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const Policies = {
  updatePolicyById: async (id, data) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  Policies
}