import { OPTIONS } from "constants/constants";
import { useMemo } from "react";
import axiosServices, { fetcher } from "utils/axios";
import useSWR from "swr";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/gallery`
};

export const useGetGallery = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  const qs = entries.length ? `?${entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}` : '';
  const key = `/${endpoints.key}${qs}`;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher, OPTIONS);
  return useMemo(() => ({ data, isLoading, mutate, error }), [data, isLoading, mutate, error]);
};

export const addGallery = (formData) =>
  axiosServices.post(`/${endpoints.key}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteGallery = (id) => axiosServices.delete(`/${endpoints.key}/${id}`);
