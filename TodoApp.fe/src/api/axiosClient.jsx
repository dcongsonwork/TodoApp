import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7061/api",
});

// Interceptor: tự động gắn JWT token vào header mọi request (nếu có)
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;