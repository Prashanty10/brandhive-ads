import api from "./axios";

export const createAdSpaceApi = async (data) => {
  try {
    const res = await api.post("/adspaces", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create ad space");
  }
};

export const getSellerAdSpacesApi = async (params = {}) => {
  try {
    const res = await api.get("/adspaces/my-advertisements", { params });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch seller ad spaces");
  }
};

export const updateAdSpaceApi = async (id, data) => {
  try {
    const res = await api.put(`/adspaces/${id}`, data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update ad space");
  }
};

export const toggleAdSpaceStatusApi = async (id, status) => {
  try {
    const res = await api.patch(`/adspaces/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to toggle status");
  }
};

export const getHomeAdSpacesApi = async () => {
  try {
    const res = await api.get("/adspaces/home");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch home ad spaces");
  }
};

export const searchAdSpacesApi = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/adspaces/search${query ? `?${query}` : ""}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to search ad spaces");
  }
};

export const getAdSpaceByIdApi = async (id) => {
  try {
    const res = await api.get(`/adspaces/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch ad space details");
  }
};

export const deleteAdSpaceApi = async (id) => {
  try {
    const res = await api.delete(`/adspaces/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete ad space");
  }
};
