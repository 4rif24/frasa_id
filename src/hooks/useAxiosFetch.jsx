{

    // import { useEffect } from 'react'
    // import axios from 'axios'
    
    // const useAxiosFetch = () => {
    //     const axiosInstance = axios.create({
    //         baseURL: 'https://frasaid-backend.vercel.app/api/',
    //      });
     
    
    //      useEffect(() => {
    //         const requestInterceptor = axios.interceptors.request.use((config) => {
    //     // Do something before request is sent
    //         return config;
    //     }, function (error) {
    //         // Do something with request error
    //         return Promise.reject(error);
    //     });
    
    //     // response interceptop
    
    //     const responseInterceptor = axios.interceptors.response.use((response) => {
    //     // Any status code that lie within the range of 2xx cause this function to trigger
    //     // Do something with response data
    //     return response;
    //   }, function (error) {
    //     // Any status codes that falls outside the range of 2xx cause this function to trigger
    //     // Do something with response error
    //     return Promise.reject(error);
    //   });
    
    //   return () => {
    //      axiosInstance.interceptors.request.eject(requestInterceptor)
    //      axiosInstance.interceptors.response.eject(responseInterceptor)
    //   }
    
    // },[axiosInstance])
    
    // return axiosInstance;
    
    
    // }
    
    
    
    //     // Interceptors
    
    
    // export default useAxiosFetch
}

// src/hooks/useAxiosFetch.jsx
import { useEffect } from 'react';
import axios from 'axios';

const useAxiosFetch = () => {
  const axiosInstance = axios.create({
    baseURL: 'https://frasaid-backend.vercel.app/api', // <-- pastikan /api
    // timeout: 10000, // optional
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []); // don't include axiosInstance in deps

  return axiosInstance;
};

export default useAxiosFetch;
