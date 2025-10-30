import axios, { AxiosError } from 'axios';
import type { Meta, Options, PaginateResponse, RequestParams } from './types';
import { MetaSchema } from './types';
import { getToken } from './utils/token';

const instance = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// EXECUTA ANTES DO REQUEST
instance.interceptors.request.use(async (config) => {
   const { userToken } = config.options ?? {};

   const token = (await getToken()) || userToken;
   if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
   } else {
      // Ensure we don't send an invalid Authorization header
      if (config.headers && 'Authorization' in config.headers)
         delete config.headers['Authorization'];
   }

   return config;
});
//CAPTURA A RESPOSTA
instance.interceptors.response.use((config) => {
   return config;
});

const request = async <TResponse, T>(configs: RequestParams<T>): Promise<TResponse | any> => {
   const { method, url, params, data, options = null } = configs;
   try {
      const response = await instance.request({
         method,
         url,
         data,
         params,
         options: options || null,
      });
      return response.data;
   } catch (err) {
      if (err instanceof AxiosError) {
         throw new Error(
            err?.response?.data?.message || err?.response?.data?.error || 'Ocorreu um erro',
         );
      }
   }
};
const get = async <TResponse, TParams extends Record<string, any> = any>(
   url: string,
   params?: TParams,
   options?: Options,
): Promise<TResponse> => {
   return request<TResponse, TParams>({ method: 'GET', url, params, options });
};

const post = async <TResponse, TData extends Record<string, any> = any>(
   url: string,
   data: TData,
   options?: Options,
): Promise<TResponse> => {
   return request<TResponse, TData>({ method: 'POST', url, data, options });
};

const put = async <TResponse, TData extends Record<string, any> = any>(
   url: string,
   data: TData,
   options?: Options,
): Promise<TResponse> => {
   return request<TResponse, TData>({ method: 'PUT', url, data, options });
};

const del = async <TResponse, TData extends Record<string, any> = any>(
   url: string,
   data: TData,
   options?: Options,
): Promise<TResponse> => {
   return request<TResponse, TData>({ method: 'DELETE', url, data, options });
};

const api = { get, post, put, delete: del };
export type { Options, RequestParams, PaginateResponse, Meta };
export { MetaSchema };
export default api;
