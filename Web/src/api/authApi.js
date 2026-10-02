import api from "./axios";

const commonError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  if (error.message) {
    throw new Error(error.message);
  }
  throw new Error("Something went wrong. Please try again.");
};

export const loginApi = async (email, password, role) => {
  try {
    const res = await api.post("/auth/login", { email, password, role });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const registerApi = async (username, email, password, role) => {
  try {
    const res = await api.post("/auth/register", { username, email, password, role });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const verifyOtpApi = async (email, otp) => {
  try {
    const res = await api.post("/auth/verify-otp", { email, otp });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const profileSetupApi = async (profileData) => {
  try {
    const res = await api.put("/auth/profile", profileData);
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const getCurrentUserApi = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const switchRoleApi = async (role) => {
  try {
    const res = await api.post("/auth/switch-role", { role });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    if (res.data?.activeRole) {
      localStorage.setItem("activeRole", res.data.activeRole);
    }
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw new Error(err.message || "Failed to switch role");
  }
};

export const forgotPasswordApi = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const verifyForgotOtpApi = async (email, otp) => {
  try {
    const res = await api.post("/auth/verify-forgot-password", { email, otp });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const newPasswordApi = async (password) => {
  try {
    const res = await api.put("/auth/new-password", { password });
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const logoutApi = async () => {
  try {
    await api.patch("/auth/logout");
  } catch (e) {
    // Ignore logout error
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("activeRole");
  }
};

export const updateBuyerProfileApi = async (buyerData) => {
  try {
    const res = await api.put("/auth/buyer-profile", buyerData);
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const updateSellerProfileApi = async (sellerData) => {
  try {
    const res = await api.put("/auth/seller-profile", sellerData);
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const updateNotificationPreferencesApi = async (notificationData) => {
  try {
    const res = await api.put("/auth/notifications", notificationData);
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const updatePrivacySettingsApi = async (privacyData) => {
  try {
    const res = await api.put("/auth/privacy", privacyData);
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const changePasswordApi = async (currentPassword, newPassword) => {
  try {
    const res = await api.put("/auth/change-password", { currentPassword, newPassword });
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const registerRoleApi = async (role, details = {}) => {
  try {
    const res = await api.post("/auth/register-role", { role, details });
    if (res.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken);
    }
    if (res.data?.activeRole) {
      localStorage.setItem("activeRole", res.data.activeRole);
    }
    return res.data;
  } catch (err) {
    commonError(err);
  }
};

export const deleteAccountApi = async () => {
  try {
    const res = await api.delete("/auth/delete-account");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("activeRole");
    return res.data;
  } catch (err) {
    commonError(err);
  }
};
