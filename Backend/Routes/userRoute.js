import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import {
  LoginHandler,
  RegisterHandler,
  verifyotp,
  ProfileHandler,
  ForgetEmailHandler,
  verifyforgetpasswordHandler,
  NewpasswordHandler,
  LogOutHandler,
  GetCurrentUserHandler,
  RefreshTokenHandler,
  SwitchRoleHandler,
  UpdateBuyerProfileHandler,
  UpdateSellerProfileHandler,
  UpdateNotificationPreferencesHandler,
  UpdatePrivacySettingsHandler,
  ChangePasswordHandler,
  RegisterRoleHandler,
  DeleteAccountHandler,
  GetUsersListHandler,
} from "../Controller/userController.js";

const router = express.Router();

router.get("/users", authMiddleware, GetUsersListHandler);
router.post("/register", RegisterHandler);
router.post("/login", LoginHandler);
router.post("/verify-otp", verifyotp);
router.put("/profile", authMiddleware, ProfileHandler);
router.put("/buyer-profile", authMiddleware, UpdateBuyerProfileHandler);
router.put("/seller-profile", authMiddleware, UpdateSellerProfileHandler);
router.put("/notifications", authMiddleware, UpdateNotificationPreferencesHandler);
router.put("/privacy", authMiddleware, UpdatePrivacySettingsHandler);
router.put("/change-password", authMiddleware, ChangePasswordHandler);
router.post("/register-role", authMiddleware, RegisterRoleHandler);
router.post("/forgot-password", ForgetEmailHandler);
router.post("/verify-forgot-password", verifyforgetpasswordHandler);
router.put("/new-password", authMiddleware, NewpasswordHandler);
router.patch("/logout", authMiddleware, LogOutHandler);
router.delete("/delete-account", authMiddleware, DeleteAccountHandler);
router.get("/me", authMiddleware, GetCurrentUserHandler);
router.post("/refresh-token", RefreshTokenHandler);
router.post("/switch-role", authMiddleware, SwitchRoleHandler);

export default router;
