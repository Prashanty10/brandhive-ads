import User from "../Models/userModel.js";
import SellerProfile from "../Models/sellerProfileModel.js";
import jwt from "jsonwebtoken";
import ForgetOtpModel from "../Models/forgetotpModel.js";
import VerifyOtpModel from "../Models/verifyotpModel.js";

import { generateForgetOtp, generateVerifyOtp } from "../Utils/otp.js";
import verifyemailotp from "../Utils/emailverification.js";
import forgetemail from "../Utils/forgetemail.js";

import generateAccessToken from "../Utils/accesstoken.js";
import generateRefreshToken from "../Utils/refreshtoken.js";

import bcrypt from "bcrypt";
import uploadToCloudinary from "../Utils/cloudinary.js";
import paginate from "../Utils/pagination.js";

export const LoginHandler = async (req, res) => {
  try {
    const { email, password , role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!existingUser.isVerified) {
      await VerifyOtpModel.deleteMany({ email });

      const otp = generateVerifyOtp();

      console.log(`otp verification code is : ${otp}`);

      await verifyemailotp(email, otp);

      await VerifyOtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.status(403).json({
        success: false,
        message: "Email not verified. A new OTP has been sent.",
      });
    }

    if (req.body.role && ["buyer", "seller"].includes(String(req.body.role).toLowerCase())) {
      const requestedRole = String(req.body.role).toLowerCase();
      if (existingUser.roles.includes(requestedRole)) {
        existingUser.activeRole = requestedRole;
      }
    }

    const accessToken = generateAccessToken(
      existingUser._id,
      existingUser.email,
      existingUser.roles,
      existingUser.activeRole
    );

    const refreshToken = generateRefreshToken(
      existingUser._id,
      existingUser.email,
      existingUser.roles,
      existingUser.activeRole
    );

    existingUser.refreshToken = refreshToken;

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      accessToken,
      refreshToken,
      isVerified: existingUser.isVerified,
      isProfileCompleted: existingUser.isProfileCompleted,
      user: {
        id: existingUser._id,
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        roles: existingUser.roles,
        activeRole: existingUser.activeRole,
        isVerified: existingUser.isVerified,
        isProfileCompleted: existingUser.isProfileCompleted,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        profileImage: existingUser.profileImage,
        city: existingUser.city,
        state: existingUser.state,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const RegisterHandler = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedRole =
      typeof role === "string" ? role.toLowerCase() : "buyer";

    if (!["buyer", "seller"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.roles.includes(normalizedRole)) {
        const roleLabel =
          normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
        return res.status(409).json({
          success: false,
          message: `${roleLabel} account already exists. Please login instead.`,
        });
      }

      existingUser.roles.push(normalizedRole);
      existingUser.activeRole = normalizedRole;

      if (normalizedRole === "seller") {
        const existingProfile = await SellerProfile.findOne({
          userId: existingUser._id,
        });
        if (!existingProfile) {
          await SellerProfile.create({ userId: existingUser._id });
        }
      }

      if (existingUser.isVerified) {
        const accessToken = generateAccessToken(
          existingUser._id,
          existingUser.email,
          existingUser.roles,
          existingUser.activeRole
        );

        const refreshToken = generateRefreshToken(
          existingUser._id,
          existingUser.email,
          existingUser.roles,
          existingUser.activeRole
        );

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        return res.status(200).json({
          success: true,
          message: `${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} role added to account successfully.`,
          accessToken,
          refreshToken,
          isVerified: true,
          isProfileCompleted: existingUser.isProfileCompleted,
          user: {
            id: existingUser._id,
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            roles: existingUser.roles,
            activeRole: existingUser.activeRole,
            isVerified: true,
            isProfileCompleted: existingUser.isProfileCompleted,
          },
        });
      }

      await existingUser.save();

      await VerifyOtpModel.deleteMany({ email });
      const otp = generateVerifyOtp();
      await verifyemailotp(email, otp);
      await VerifyOtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.status(200).json({
        success: true,
        message: `${normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} role added. Please verify OTP sent to your email.`,
        isVerified: false,
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          roles: existingUser.roles,
          activeRole: existingUser.activeRole,
          isVerified: false,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      username,
      email,
      password: hashedPassword,
      roles: [normalizedRole],
      activeRole: normalizedRole,
    });

    if (normalizedRole === "seller") {
      await SellerProfile.create({ userId: newuser._id });
    }

    await VerifyOtpModel.deleteMany({ email });

    const otp = generateVerifyOtp();

    await verifyemailotp(email, otp);

    console.log(`otp verification code is : ${otp}`);
    await VerifyOtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email",
      user: {
        id: newuser._id,
        username: newuser.username,
        email: newuser.email,
        roles: newuser.roles,
        activeRole: newuser.activeRole,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const cleanOtp = typeof otp === "string" || typeof otp === "number" ? String(otp).trim() : "";

    const otpData = await VerifyOtpModel.findOne({ email: normalizedEmail });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (String(otpData.otp).trim() !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpData.expiresAt < new Date()) {
      await VerifyOtpModel.deleteMany({ email: normalizedEmail });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const userexist = await User.findOne({ email: normalizedEmail });

    if (!userexist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    userexist.isVerified = true;

    const accessToken = generateAccessToken(
      userexist._id,
      userexist.email,
      userexist.roles,
      userexist.activeRole
    );

    const refreshToken = generateRefreshToken(
      userexist._id,
      userexist.email,
      userexist.roles,
      userexist.activeRole
    );

    userexist.refreshToken = refreshToken;

    await userexist.save();

    await VerifyOtpModel.deleteMany({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: userexist._id,
        username: userexist.username,
        email: userexist.email,
        roles: userexist.roles,
        activeRole: userexist.activeRole,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const ProfileHandler = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      mobile,
      phoneNumber,
      city,
      state,
      bio,
      profileImage,
      location,
      latitude,
      longitude,
    } = req.body;

    let imageUrl = profileImage || "";

    if (
      profileImage &&
      typeof profileImage === "string" &&
      profileImage.startsWith("data:image")
    ) {
      const uploadedImage = await uploadToCloudinary(
        profileImage,
        "brandhive/users",
      );
      imageUrl = uploadedImage.secure_url;
    }

    const updateFields = {
      firstName,
      lastName,
      mobileNumber: mobileNumber || mobile || phoneNumber || "",
      city,
      state,
      bio,
      profileImage: imageUrl,
      isProfileCompleted: true,
    };

    let inputLat = latitude !== undefined && latitude !== "" ? latitude : location?.latitude;
    let inputLng = longitude !== undefined && longitude !== "" ? longitude : location?.longitude;

    if (inputLat === undefined && Array.isArray(location?.coordinates) && location.coordinates.length === 2) {
      inputLng = location.coordinates[0];
      inputLat = location.coordinates[1];
    }

    if (inputLat != null && inputLng != null && inputLat !== "" && inputLng !== "") {
      const lat = parseFloat(inputLat);
      const lng = parseFloat(inputLng);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updateFields.location = {
          type: "Point",
          coordinates: [lng, lat],
        };
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    if (Array.isArray(userObj.location?.coordinates) && userObj.location.coordinates.length === 2) {
      userObj.longitude = userObj.location.coordinates[0];
      userObj.latitude = userObj.location.coordinates[1];
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const ForgetEmailHandler = async (req, res) => {
  try {
    const { email } = req.body;

    await ForgetOtpModel.deleteMany({ email });

    const otp = generateForgetOtp();

    console.log(`forget password otp code is : ${otp}`);
    await forgetemail(email, otp);

    await ForgetOtpModel.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email please verifyy it ",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyforgetpasswordHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const dataexist = await ForgetOtpModel.findOne({ email });

    if (!dataexist) {
      return res.status(404).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    if (dataexist.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (dataexist.expiresAt < new Date()) {
      await ForgetOtpModel.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    await ForgetOtpModel.deleteOne({ email });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const NewpasswordHandler = async (req, res) => {
  try {
    const { password } = req.body;

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: hashpassword,
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const LogOutHandler = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        refreshToken: null,
      },
      {
        returnDocument: "after",
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetCurrentUserHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObj = user.toObject();
    if (Array.isArray(userObj.location?.coordinates) && userObj.location.coordinates.length === 2) {
      userObj.longitude = userObj.location.coordinates[0];
      userObj.latitude = userObj.location.coordinates[1];
    }

    return res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const RefreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId =
      decoded._id ||
      decoded.userId ||
      decoded.id ||
      (decoded.user && (decoded.user._id || decoded.user.id));

    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const SwitchRoleHandler = async (req, res) => {
  try {
    const { role } = req.body;
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";

    if (!["buyer", "seller"].includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.roles.includes(normalizedRole)) {
      const targetLabel = normalizedRole === "seller" ? "Seller" : "Buyer";
      return res.status(403).json({
        success: false,
        hasRole: false,
        message: `Not registered as ${targetLabel}. You have not registered a ${targetLabel.toLowerCase()} account with this email (${user.email}).`,
      });
    }

    user.activeRole = normalizedRole;
    await user.save();

    const accessToken = generateAccessToken(
      user._id,
      user.email,
      user.roles,
      user.activeRole
    );

    return res.status(200).json({
      success: true,
      message: `Switched active role to ${normalizedRole}`,
      accessToken,
      activeRole: user.activeRole,
      roles: user.roles,
    });
  } catch (error) {
    console.error("Switch Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const UpdateBuyerProfileHandler = async (req, res) => {
  try {
    const {
      advertisingPreferences,
      preferredCategories,
      preferredLocations,
      preferredCity,
      preferredArea,
      onlineAds,
      offlineAds,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.buyerProfile = {
      ...user.buyerProfile,
      advertisingPreferences: Array.isArray(advertisingPreferences) ? advertisingPreferences : user.buyerProfile?.advertisingPreferences || [],
      preferredCategories: Array.isArray(preferredCategories) ? preferredCategories : user.buyerProfile?.preferredCategories || [],
      preferredLocations: Array.isArray(preferredLocations) ? preferredLocations : user.buyerProfile?.preferredLocations || [],
      preferredCity: preferredCity !== undefined ? preferredCity : user.buyerProfile?.preferredCity || "",
      preferredArea: preferredArea !== undefined ? preferredArea : user.buyerProfile?.preferredArea || "",
      onlineAds: onlineAds !== undefined ? Boolean(onlineAds) : user.buyerProfile?.onlineAds ?? true,
      offlineAds: offlineAds !== undefined ? Boolean(offlineAds) : user.buyerProfile?.offlineAds ?? true,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Buyer preferences updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const UpdateSellerProfileHandler = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      businessDescription,
      businessAddress,
      businessCity,
      businessState,
      businessPincode,
      businessPhone,
      businessEmail,
      gstNumber,
      panNumber,
      sellerCategories,
      bankDetails,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.sellerProfile = {
      ...user.sellerProfile,
      businessName: businessName !== undefined ? businessName : user.sellerProfile?.businessName || "",
      businessType: businessType !== undefined ? businessType : user.sellerProfile?.businessType || "Individual / Agency",
      businessDescription: businessDescription !== undefined ? businessDescription : user.sellerProfile?.businessDescription || "",
      businessAddress: businessAddress !== undefined ? businessAddress : user.sellerProfile?.businessAddress || "",
      businessCity: businessCity !== undefined ? businessCity : user.sellerProfile?.businessCity || "",
      businessState: businessState !== undefined ? businessState : user.sellerProfile?.businessState || "",
      businessPincode: businessPincode !== undefined ? businessPincode : user.sellerProfile?.businessPincode || "",
      businessPhone: businessPhone !== undefined ? businessPhone : user.sellerProfile?.businessPhone || "",
      businessEmail: businessEmail !== undefined ? businessEmail : user.sellerProfile?.businessEmail || "",
      gstNumber: gstNumber !== undefined ? gstNumber : user.sellerProfile?.gstNumber || "",
      panNumber: panNumber !== undefined ? panNumber : user.sellerProfile?.panNumber || "",
      sellerCategories: Array.isArray(sellerCategories) ? sellerCategories : user.sellerProfile?.sellerCategories || [],
      bankDetails: bankDetails ? { ...user.sellerProfile?.bankDetails, ...bankDetails } : user.sellerProfile?.bankDetails,
    };

    await user.save();

    let existingProfile = await SellerProfile.findOne({ userId: user._id });
    if (!existingProfile) {
      existingProfile = new SellerProfile({ userId: user._id });
    }
    if (businessName) existingProfile.businessName = businessName;
    if (gstNumber) existingProfile.gst = gstNumber;
    if (bankDetails) existingProfile.bankDetails = { ...existingProfile.bankDetails, ...bankDetails };
    await existingProfile.save();

    return res.status(200).json({
      success: true,
      message: "Seller business information updated successfully",
      user,
      sellerProfile: user.sellerProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const UpdateNotificationPreferencesHandler = async (req, res) => {
  try {
    const { pushNotifications, emailNotifications, marketingNotifications, buyerNotifications, sellerNotifications } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.notificationPreferences = {
      pushNotifications: pushNotifications !== undefined ? Boolean(pushNotifications) : user.notificationPreferences?.pushNotifications ?? true,
      emailNotifications: emailNotifications !== undefined ? Boolean(emailNotifications) : user.notificationPreferences?.emailNotifications ?? true,
      marketingNotifications: marketingNotifications !== undefined ? Boolean(marketingNotifications) : user.notificationPreferences?.marketingNotifications ?? false,
      buyerNotifications: { ...user.notificationPreferences?.buyerNotifications, ...buyerNotifications },
      sellerNotifications: { ...user.notificationPreferences?.sellerNotifications, ...sellerNotifications },
    };

    await user.save();
    return res.status(200).json({ success: true, message: "Notification preferences updated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const UpdatePrivacySettingsHandler = async (req, res) => {
  try {
    const { showProfileInfo, showPhoneNumber, showEmail, locationVisibility, personalizedRecs, language, appearance } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.privacySettings = {
      showProfileInfo: showProfileInfo !== undefined ? Boolean(showProfileInfo) : user.privacySettings?.showProfileInfo ?? true,
      showPhoneNumber: showPhoneNumber !== undefined ? Boolean(showPhoneNumber) : user.privacySettings?.showPhoneNumber ?? false,
      showEmail: showEmail !== undefined ? Boolean(showEmail) : user.privacySettings?.showEmail ?? false,
      locationVisibility: locationVisibility !== undefined ? Boolean(locationVisibility) : user.privacySettings?.locationVisibility ?? true,
      personalizedRecs: personalizedRecs !== undefined ? Boolean(personalizedRecs) : user.privacySettings?.personalizedRecs ?? true,
    };
    if (language) user.language = language;
    if (appearance) user.appearance = appearance;

    await user.save();
    return res.status(200).json({ success: true, message: "Privacy settings updated", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const ChangePasswordHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const RegisterRoleHandler = async (req, res) => {
  try {
    const { role, sellerProfileData } = req.body;
    const normalizedRole = typeof role === "string" ? role.toLowerCase() : "";

    if (!["buyer", "seller"].includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.roles.includes(normalizedRole)) {
      user.roles.push(normalizedRole);
    }
    user.activeRole = normalizedRole;

    if (normalizedRole === "seller") {
      if (sellerProfileData) {
        user.sellerProfile = {
          ...user.sellerProfile,
          ...sellerProfileData,
        };
      }
      let existingProfile = await SellerProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        await SellerProfile.create({ userId: user._id, businessName: sellerProfileData?.businessName || "" });
      }
    }

    await user.save();

    const accessToken = generateAccessToken(user._id, user.email, user.roles, user.activeRole);
    const refreshToken = generateRefreshToken(user._id, user.email, user.roles, user.activeRole);
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Registered as ${normalizedRole} and switched active mode successfully.`,
      accessToken,
      refreshToken,
      activeRole: user.activeRole,
      roles: user.roles,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const DeleteAccountHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.accountStatus = "deleted";
    user.refreshToken = null;
    await user.save();

    await User.findByIdAndDelete(userId);
    await SellerProfile.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Account permanently deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const GetUsersListHandler = async (req, res) => {
  try {
    const filter = { accountStatus: { $ne: "deleted" } };
    if (req.query.role) filter.roles = req.query.role;
    if (req.query.q) {
      const qRegex = new RegExp(req.query.q.trim(), "i");
      filter.$or = [{ firstName: qRegex }, { lastName: qRegex }, { email: qRegex }, { username: qRegex }];
    }

    const result = await paginate(User, filter, {
      reqQuery: req.query,
      selectFields: "-password -refreshToken",
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
