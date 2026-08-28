// import axios from "axios";

// let accessToken: string | null = null;
// export const setAccessToken = (token: string | null) => {
//     accessToken = token;
// }

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true,
// })

// api.interceptors.request.use((config) => {
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// });

// let isRefreshing = false;
// let queue: Array<(token: string) => void> = [];

// api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const original = error.config;

//         if (error.response?.status === 401 && !original._retry) {
//             original._retry = true;

//             if (!isRefreshing) {
//                 isRefreshing = true;
//                 try {
//                     const { data } = await axios.post(
//                         `${import.meta.env.VITE_API_URL}/auth/refresh`,
//                         {},
//                         { withCredentials: true }
//                     );
//                     setAccessToken(data.accessToken);
//                     queue.forEach((cb) => cb(data.accessToken));
//                     queue = [];
//                 } finally {
//                     isRefreshing = false;
//                 }
//             }

//             return new Promise((resolve) => {
//                 queue.push((newToken: string) => {
//                     original.headers.Authorization = `Bearer ${newToken}`;
//                     resolve(api(original));
//                 });
//             });
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;

import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // needed for cookie-based refresh
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;