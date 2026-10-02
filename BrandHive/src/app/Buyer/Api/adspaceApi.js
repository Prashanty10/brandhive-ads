import api from "./Api";

/**
 * Fetch consolidated Home data from backend (Real MongoDB AdSpaces)
 */
export const getHomeAdSpacesApi = async (params = {}) => {
  try {
    const response = await api.get("/adspaces/home", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching Home adspaces:", error);
    throw error.response?.data || error;
  }
};

/**
 * Search and filter ad spaces
 */
export const searchAdSpacesApi = async (params = {}) => {
  try {
    const response = await api.get("/adspaces/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching adspaces:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch detailed information for a single ad space by ID
 */
export const getAdSpaceDetailApi = async (id) => {
  try {
    const response = await api.get(`/adspaces/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching adspace details:", error);
    throw error.response?.data || error;
  }
};

/**
 * Create a new advertisement space (Seller)
 */
export const createAdSpaceApi = async (adData) => {
  try {
    const response = await api.post("/adspaces", adData);
    return response.data;
  } catch (error) {
    console.error("Error creating adspace:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch seller's listed advertisements
 */
export const getMyAdvertisementsApi = async (params = {}) => {
  try {
    const response = await api.get("/adspaces/my-advertisements", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching my advertisements:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update seller's advertisement
 */
export const updateAdSpaceApi = async (id, updateData) => {
  try {
    const response = await api.put(`/adspaces/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating adspace:", error);
    throw error.response?.data || error;
  }
};

/**
 * Toggle advertisement active status
 */
export const toggleAdSpaceStatusApi = async (id, status) => {
  try {
    const response = await api.patch(`/adspaces/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error toggling adspace status:", error);
    throw error.response?.data || error;
  }
};

/**
 * Create a real booking (Buyer)
 */
export const createBookingApi = async (bookingData) => {
  try {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch buyer's bookings
 */
export const getBuyerBookingsApi = async (params = {}) => {
  try {
    const response = await api.get("/bookings", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer bookings:", error);
    throw error.response?.data || error;
  }
};

/**
 * Cancel a booking
 */
export const cancelBookingApi = async (id) => {
  try {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetch seller's incoming bookings
 */
export const getSellerBookingsApi = async (params = {}) => {
  try {
    const response = await api.get("/bookings/seller-bookings", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching seller bookings:", error);
    throw error.response?.data || error;
  }
};

/**
 * Update booking status (Seller approves/declines)
 */
export const updateBookingStatusApi = async (id, status) => {
  try {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error.response?.data || error;
  }
};

const AdspaceApiRoute = () => null;
export default AdspaceApiRoute;

