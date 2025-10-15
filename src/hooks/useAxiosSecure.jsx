{

  // import React, { useContext, useEffect } from 'react'
  // import {AuthContext} from "../utilities/providers/AuthProvider"
  // import {useNavigate} from "react-router-dom"
  // import axios from 'axios';
  
  // const useAxiosSecure = () => {
  //   const {logout} = useContext(AuthContext);
  //   const navigate = useNavigate();
  
  //   const axiosSecure = axios.create({
  //   baseURL: 'http://localhost:5000/api/'  
  // });
  
  // useEffect(() => {
  //   const requestInterceptor = axiosSecure.interceptors.request.use((config)  => {
  //     const token = localStorage.getItem('token');
  //     if(token) {
  //       config.headers.Authorization = `Bearer ${token}`;
  //     }
  //     return config
  //   })
  
  //   // respon interceptors
  //   const responseInterceptor = axiosSecure.interceptors.response.use((response) => response, async(error) => {
  //     if(error.response && (error.response.status === 401 || error.response.status === 403)) {
  //       await logout();
  //       navigate('/login');
  //       throw error;
  //     }
  //     throw error
  //   })
  
  //   return () => {
  //     axiosSecure.interceptors.request.eject(requestInterceptor);
  //     axiosSecure.interceptors.response.eject(responseInterceptor);
  
  //   }
  // }, [logout, navigate, axiosSecure])
  
  //   return axiosSecure;  
  // }
  
  // export default useAxiosSecure
  // import { useContext } from 'react';
  // import { AuthContext } from "../utilities/providers/AuthProvider";
  // import { useNavigate } from "react-router-dom";
  // import axios from 'axios';
  
  // const useAxiosSecure = () => {
  //   const { logout } = useContext(AuthContext);
  //   const navigate = useNavigate();
  
  //   const axiosSecure = axios.create({
  //     baseURL: 'http://localhost:5000',
  //     // withCredentials: true // Jika menggunakan cookies
  //   });
  
  //   // Request interceptor
  //   axiosSecure.interceptors.request.use((config) => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       config.headers.Authorization = `Bearer ${token}`; // Perbaikan typo "Baerer" -> "Bearer"
  //     }
  //     return config;
  //   }, (error) => {
  //     return Promise.reject(error);
  //   });
  
  //   // Response interceptor
  //   axiosSecure.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
  //         await logout();
  //         localStorage.removeItem('token'); // Bersihkan token yang sudah tidak valid
  //         navigate('/login');
  //       }
  //       return Promise.reject(error);
  //     }
  //   );
  
  //   return axiosSecure;
  // };
  
  // export default useAxiosSecure;
}

import { useEffect } from 'react';
import axios from 'axios';

const useAxiosSecure = () => {
  const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000/api/',
  });

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => Promise.reject(error));
  }, [axiosSecure]);

  return axiosSecure;
}

export default useAxiosSecure;




