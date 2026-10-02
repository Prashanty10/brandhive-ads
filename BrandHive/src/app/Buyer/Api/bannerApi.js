import api from "./Api";

const commonError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong fetching banners");
  }

  if (error.request) {
    throw new Error("Server is not responding");
  }

  throw new Error(error.message || "Something went wrong");
};

export const getBannersApi = async () => {
  try {
    const response = await api.get("/banner");
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

export const getFeaturedBannersApi = async () => {
  try {
    const response = await api.get("/banner/featured");
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

export const getBannerByIdApi = async (id) => {
  try {
    const response = await api.get(`/banner/${id}`);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const BannerApiRoute = () => null;
export default BannerApiRoute;
