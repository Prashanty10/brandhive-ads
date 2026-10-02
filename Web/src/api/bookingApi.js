import api from "./axios";

export const createBookingApi = async (bookingData) => {
  try {
    const res = await api.post("/bookings", bookingData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to submit booking request");
  }
};

export const getBuyerBookingsApi = async (params = {}) => {
  try {
    const res = await api.get("/bookings", { params });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch campaign bookings");
  }
};

export const getSellerBookingsApi = async (params = {}) => {
  try {
    const res = await api.get("/bookings/seller-bookings", { params });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch seller bookings");
  }
};

export const updateBookingStatusApi = async (id, status) => {
  try {
    const res = await api.patch(`/bookings/${id}/status`, { status });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update booking status");
  }
};

export const cancelBookingApi = async (id) => {
  try {
    const res = await api.patch(`/bookings/${id}/cancel`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to cancel booking request");
  }
};
