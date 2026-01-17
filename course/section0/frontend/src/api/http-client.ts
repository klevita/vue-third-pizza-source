import axios, { AxiosError } from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useUserStore } from "@/stores/user";

const reject = (error: AxiosError) => {
  if (error.response) {
    const { data } = error.response;
    if (data && typeof data === "object" && "error" in data) {
      const errorData = data as { error?: { message?: string } };
      if (errorData.error?.message) {
        toast(errorData.error.message, {
          type: "error",
        });
      }
    }
  }

  return Promise.reject(error);
};

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = "Bearer " + userStore.token;
  }
  return config;
}, reject);

apiClient.interceptors.response.use((response) => {
  return response.data;
}, reject);
