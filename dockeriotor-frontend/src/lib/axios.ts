import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
