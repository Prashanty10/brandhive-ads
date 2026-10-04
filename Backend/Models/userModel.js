import mongoose from "mongoose";

const buyerProfileSchema = new mongoose.Schema(
  {
    advertisingPreferences: { type: [String], default: [] },
    preferredCategories: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    preferredCity: { type: String, default: "" },
    preferredArea: { type: String, default: "" },
    onlineAds: { type: Boolean, default: true },
    offlineAds: { type: Boolean, default: true },
  },
  { _id: false }
);

const sellerProfileSchema = new mongoose.Schema(
  {
    businessName: { type: String, trim: true, default: "" },
    businessType: { type: String, trim: true, default: "Individual / Agency" },
    businessDescription: { type: String, trim: true, default: "" },
    businessAddress: { type: String, trim: true, default: "" },
    businessCity: { type: String, trim: true, default: "" },
    businessState: { type: String, trim: true, default: "" },
    businessPincode: { type: String, trim: true, default: "" },
    businessPhone: { type: String, trim: true, default: "" },
    businessEmail: { type: String, trim: true, default: "" },
    gstNumber: { type: String, trim: true, default: "" },
    panNumber: { type: String, trim: true, default: "" },
    sellerCategories: { type: [String], default: [] },
    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    sellerStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    bankDetails: {
      accountNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
      accountHolderName: { type: String, default: "" },
      bankName: { type: String, default: "" },
    },
  },
  { _id: false }
);

const notificationPreferencesSchema = new mongoose.Schema(
  {
    pushNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    marketingNotifications: { type: Boolean, default: false },
    buyerNotifications: {
      bookingUpdates: { type: Boolean, default: true },
      adAlerts: { type: Boolean, default: true },
      priceAlerts: { type: Boolean, default: true },
      campaignUpdates: { type: Boolean, default: true },
    },
    sellerNotifications: {
      newBookingRequests: { type: Boolean, default: true },
      bookingStatusUpdates: { type: Boolean, default: true },
      adStatus: { type: Boolean, default: true },
      payoutAlerts: { type: Boolean, default: true },
      sellerUpdates: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const privacySettingsSchema = new mongoose.Schema(
  {
    showProfileInfo: { type: Boolean, default: true },
    showPhoneNumber: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },
    locationVisibility: { type: Boolean, default: true },
    personalizedRecs: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: [30, "First name cannot exceed 30 characters"],
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [30, "Last name cannot exceed 30 characters"],
      default: "",
    },

    mobileNumber: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    roles: {
      type: [String],
      enum: ["buyer", "seller", "admin"],
      default: ["buyer"],
    },

    activeRole: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    language: {
      type: String,
      default: "English",
    },

    appearance: {
      type: String,
      default: "Light",
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended", "deleted"],
      default: "active",
    },

    buyerProfile: {
      type: buyerProfileSchema,
      default: () => ({}),
    },

    sellerProfile: {
      type: sellerProfileSchema,
      default: () => ({}),
    },

    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },

    privacySettings: {
      type: privacySettingsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ roles: 1, activeRole: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
