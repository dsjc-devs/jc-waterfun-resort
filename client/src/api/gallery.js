import { OPTIONS } from "constants/constants";
import { useMemo } from "react";
import axiosServices, { fetcher } from "utils/axios";

import useSWR from "swr";
import { id } from "date-fns/locale";

const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/gallery`,
};

export const useGetGallery = () => {
  const { data, isLoading, error, mutate } = useSWR(`/${endpoints.key}`, fetcher, OPTIONS);

  const memoizedValue = useMemo(() => ({
    data,
    isLoading,
    mutate,
    error
  }), [data, isLoading, mutate, error]);

  return memoizedValue;
};
