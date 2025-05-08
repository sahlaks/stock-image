import axios from "axios";
import toast from "react-hot-toast";
import { generateAccessToken, userLogout } from "../API/userApi";

//baseURL:'http://localhost:5000',
export const axiosInstance = axios.create({
    baseURL:'https://piccloud.shop',   
     headers:{
         'Content-Type':'application/json'
     },
     withCredentials: true
 })

//  axiosInstance.interceptors.response.use((response) => {
//     return response;
// },        
//     async (error) => {
//         const originalRequest = error.config;
//         if(error.response){
//             const status = error.response.status;
//             if (status === 401) {
//                 if (error.response.data.message === 'Refresh Token Expired') {
//                     toast.error('Please login to access this page')
//                     await userLogout()
//                 }  else if (error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
//                     originalRequest._retry = true;
//                     try {
//                         await generateAccessToken()
//                         return axiosInstance(originalRequest)
//                     } catch (refreshError) {
//                         toast.error('Unable to refresh access token. Please log in again.');
//                         return Promise.reject(refreshError);
//                     }
//                 } 
//             }
//              else if (status === 403) {
//                 toast.error('Access denied. Please log in.');
//                 await userLogout()
//         } else {
//             toast.error('Network error. Please check your connection.');  
//             navigate('/500')
//         } 
//          return Promise.reject(error)
//     }
// }
// )