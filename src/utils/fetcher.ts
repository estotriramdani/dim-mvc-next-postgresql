import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = async <T>(url: string, options?: AxiosRequestConfig) => {
  const res = await axios(url, options);
  return res.data as T;
};
