import api from "./axios.js";

export const placeOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my-orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`);

export const getAdminStats = () => api.get("/admin/stats");
export const getAllOrders = (params) => api.get("/admin/orders", { params });
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });

export const getAllUsers = () => api.get("/admin/users");
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
