import axiosClient from "./axiosClient";

export const taskApi = {
  getAll: () => axiosClient.get("/tasks"),
  create: (data) => axiosClient.post("/tasks", data),
  update: (id, data) => axiosClient.put(`/tasks/${id}`, data),
  remove: (id) => axiosClient.delete(`/tasks/${id}`),
  toggleComplete: (id) => axiosClient.patch(`/tasks/${id}/toggle-complete`),
};

export const userApi = {
  getAll: () => axiosClient.get("/users"),
};