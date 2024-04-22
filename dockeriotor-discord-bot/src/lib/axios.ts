import Config from "@/config";
import axios from "axios";

const apiInstance = axios.create({
  baseURL: Config.apiUrl,
});

apiInstance.interceptors.request.use((config) => {
  config.headers["x-api-key"] = Config.apiKey;

  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default apiInstance;
