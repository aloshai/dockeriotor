import axios from "axios";

const apiInstance = axios.create({
  baseURL: "http://localhost:3000",
});

apiInstance.interceptors.request.use((config) => {
  config.headers["x-api-key"] = process.env.TELEGRAM_BOT_API_KEY;

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
