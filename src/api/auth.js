import axios from "./axios";

export const registerRequest = (user) => axios.post(`/register`, user);

export const loginRequest = (user) => axios.post(`/login`, user);

export const verifyTokenRequest = () => axios.get("/verify");

export const logoutRequest = () => axios.post("/logout");

//gestion de usuarios
export const updateProfileRequest = (userData) =>
  axios.put("/profile", userData);

export const changePasswordRequest = (passwordData) =>
  axios.put("/change-password", passwordData);

export const deleteAccountRequest = (accountData) =>
  axios.delete("/account", { data: accountData });

export const getUsersRequest = () => axios.get("/users");

export const getUserByIdRequest = (id) => axios.get(`/users/${id}`);

//administradores

export const toggleUserStatusRequest = (id, isActive) =>
  axios.put(`/users/${id}/toggle-status`, { isActive });

export const deleteUserRequest = (id) => axios.delete(`/users/${id}`);

export const changeUserRoleRequest = (id, role) =>
  axios.put(`/users/${id}/change-role`, { role });

export const refreshTokenRequest = () => axios.post("/refresh-token");
