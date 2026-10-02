import api from "../Api/Api";
import * as SecureStore from "expo-secure-store";

const commonError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.message || "Something went wrong");
  }

  if (error.request) {
    throw new Error("Server is not responding");
  }

  throw new Error(error.message || "Something went wrong");
};

const LoginApi = async (email, password, role) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
      role,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const RegisterApi = async (username, email, password, role) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
      role,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const profileSetupApi = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const verifyUser = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const forgotPasswordApi = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/auth/verify-forgot-password", {
      email,
      otp,
    });

    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const newPasswordApi = async (password) => {
  try {
    const response = await api.put("/auth/new-password", {
      password,
    });

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const userInfo = async () => {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const switchRoleApi = async (role) => {
  try {
    const response = await api.post("/auth/switch-role", { role });
    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.activeRole) {
      await SecureStore.setItemAsync("activeRole", response.data.activeRole);
    }
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw new Error(error.message || "Failed to switch role");
  }
};

const logoutApi = async () => {
  try {
    await api.patch("/auth/logout");
  } catch (e) {
  } finally {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("activeRole");
  }
};

const updateBuyerProfileApi = async (buyerData) => {
  try {
    const response = await api.put("/auth/buyer-profile", buyerData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const updateSellerProfileApi = async (sellerData) => {
  try {
    const response = await api.put("/auth/seller-profile", sellerData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const updateNotificationPreferencesApi = async (notificationData) => {
  try {
    const response = await api.put("/auth/notifications", notificationData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const updatePrivacySettingsApi = async (privacyData) => {
  try {
    const response = await api.put("/auth/privacy", privacyData);
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const changePasswordApi = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const registerRoleApi = async (role, details = {}) => {
  try {
    const response = await api.post("/auth/register-role", { role, details });
    if (response.data?.accessToken) {
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    }
    if (response.data?.activeRole) {
      await SecureStore.setItemAsync("activeRole", response.data.activeRole);
    }
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

const deleteAccountApi = async () => {
  try {
    const response = await api.delete("/auth/delete-account");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("activeRole");
    return response.data;
  } catch (error) {
    commonError(error);
  }
};

export {
  LoginApi,
  RegisterApi,
  profileSetupApi,
  verifyUser,
  forgotPasswordApi,
  verifyOtp,
  newPasswordApi,
  userInfo,
  switchRoleApi,
  logoutApi,
  updateBuyerProfileApi,
  updateSellerProfileApi,
  updateNotificationPreferencesApi,
  updatePrivacySettingsApi,
  changePasswordApi,
  registerRoleApi,
  deleteAccountApi,
};

const UserApiRoute = () => null;
export default UserApiRoute;
