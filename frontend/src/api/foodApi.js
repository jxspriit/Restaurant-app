import api from "./axios.js";

export const getFoods = (params) => api.get("/foods", { params });
export const getFoodById = (id) => api.get(`/foods/${id}`);
export const createFood = (formData) =>
  api.post("/foods", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateFood = (id, formData) =>
  api.put(`/foods/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteFood = (id) => api.delete(`/foods/${id}`);
