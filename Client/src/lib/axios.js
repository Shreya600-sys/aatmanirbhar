import axios from "axios";

// VITE_API_URL can be written with or without "/api/v1" (e.g. https://my-api.onrender.com)
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
const baseURL = rawApiUrl.replace(/\/+$/, "").replace(/\/api\/v1$/, "") + "/api/v1";

const apiClient = axios.create({ baseURL });

// Send the saved login token with every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the saved login has expired, clear it and go to the login page.
// Login / register / "who am I" requests are skipped so their own error messages can be shown.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCheck =
      url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/me");

    if (error.response?.status === 401 && !isAuthCheck && localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
