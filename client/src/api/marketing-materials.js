import { useMemo } from "react";
import axiosServices, { fetcher } from 'utils/axios'
import useSWR from "swr";
import { OPTIONS } from "constants/constants";

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/marketing-materials`,
};

export const useGetMarketingMaterials = (queryObj = {}) => {
  const key = `/${endpoints.key}?${new URLSearchParams(queryObj).toString()}`;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);
  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);
  return memoizedValue;
};

export const useGetSingleMarketingMaterial = (materialId) => {
  const apiURL = materialId && `/${endpoints.key}/${materialId}`;

  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};

const MarketingMaterials = {
  addMarketingMaterial: async (payload) => {
    try {
      const response = await axiosServices.post(`/${endpoints.key}/create`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  editMarketingMaterial: async (materialId, payload) => {
    try {
      const response = await axiosServices.patch(`/${endpoints.key}/${materialId}`, payload)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  },
  deleteMarketingMaterial: async (materialId) => {
    try {
      const response = await axiosServices.delete(`/${endpoints.key}/${materialId}`)
      return response
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  }
}

export default {
  MarketingMaterials
};
