import api from "./axios";

export const getAllBanners = async () => {
  try {
    const res = await api.get("/banner");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch banners");
  }
};

export const getFeaturedBanners = async () => {
  try {
    const res = await api.get("/banner/featured");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch featured banners");
  }
};

export const getBannerById = async (id) => {
  try {
    const res = await api.get(`/banner/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch banner");
  }
};
