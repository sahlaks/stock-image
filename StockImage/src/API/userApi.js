import { API_ENDPOINTS } from "../Constants/apiConstants";
import { axiosInstance } from "../Services/AxiosConfig";

//SIGNUP
export const userSignup = async (data) => {
  try {
    console.log(data);
    
    const res = await axiosInstance.post(API_ENDPOINTS.USER_SIGNUP, data);
    console.log(res);
    
    return res.data;
  } catch (err) {
    throw err;
  }
};

//LOGIN
export const userLogin = async (data) => {
  try {
    console.log(data);
    
    const res = await axiosInstance.post(API_ENDPOINTS.USER_LOGIN, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//UPLOAD IMAGES
export const uploadImages = async (images) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.UPLOAD_IMAGES, images, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

//SHOW IMAGES OF USER
export const showImages = async () => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.FETCH_IMAGES);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

//DELETE IMAGE
export const deleteImage = async (imageId) => {
  try {
    const res = await axiosInstance.delete(
      `${API_ENDPOINTS.DELETE_IMAGE}/${imageId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//UPDATE IMAGE
export const updateImage = async (data) => {
  try {
    console.log(data);
    const res = await axiosInstance.put(API_ENDPOINTS.EDIT_IMAGE, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

//SAVE POSITION
export const savePosition = async (data) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.POSITION_UPDATE, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

//RESET PASSWORD
export const resetPassword = async (currentpassword, newpassword) => {
  try {
    console.log(currentpassword, newpassword);
    const res = await axiosInstance.post(API_ENDPOINTS.PASSWORD_RESET, {
      currentpassword,
      newpassword,
    });

    console.log(res);
    return res.data;
  } catch (err) {
    return {
        success: false,
        message: err.response?.data?.message || "Failed to reset password.",
        errors: err.response?.data?.errors || [],
      };
  }
};

//REFRESH ACCESS TOKEN
export async function generateAccessToken(){
      const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN)
      console.log(response)
  }

//LOGOUT USER
export const userLogout = async () => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return res.data;
  } catch (err) {
    throw err;
  }
};
