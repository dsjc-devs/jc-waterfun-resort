import axiosServices, { fetcher } from 'utils/axios';
import useSWR from 'swr';
import { useMemo } from 'react';
import { OPTIONS } from 'constants/constants';

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/activities`,
};

export const useGetActivities = (reservationId) => {
  const apiURL = reservationId && `/${endpoints.key}?reservationId=${reservationId}`;
  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  return useMemo(() => ({ data, isLoading, error, mutate }), [data, isLoading, error, mutate]);
};
