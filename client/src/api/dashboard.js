import axiosServices, { fetcher } from 'utils/axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { OPTIONS } from 'constants/constants';

export const endpoints = {
  key: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/dashboard`,
  financialAnalytics: `${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/dashboard/financial-analytics`
};

export const useGetDashboardStats = (query = {}) => {
  const searchParams = new URLSearchParams();

  if (query.month) {
    searchParams.append('month', query.month);
  }

  if (query.year) {
    searchParams.append('year', query.year);
  }

  const queryString = searchParams.toString();
  const apiURL = queryString ? `/${endpoints.key}?${queryString}` : `/${endpoints.key}`;

  const { data, isLoading, error, mutate } = useSWR(apiURL, fetcher, OPTIONS);

  return useMemo(() => ({
    data,
    isLoading,
    error,
    mutate
  }), [data, isLoading, error, mutate]);
};

const Dashboard = {
  getFinancialAnalytics: async (query = {}) => {
    try {
      const searchParams = new URLSearchParams();

      if (query.month) {
        searchParams.append('month', query.month);
      }

      if (query.year) {
        searchParams.append('year', query.year);
      }

      const queryString = searchParams.toString();
      const endpoint = queryString
        ? `/${endpoints.financialAnalytics}?${queryString}`
        : `/${endpoints.financialAnalytics}`;

      const response = await axiosServices.get(endpoint);
      return response?.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to fetch financial analytics.';
      throw new Error(message);
    }
  }
};

export default {
  Dashboard
};
