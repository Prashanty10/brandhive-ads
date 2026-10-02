import express from "express";
import {
  adspacecontroller,
  adSpaceInfo,
  updateAdSpace,
  toggleAdSpaceStatus,
  getAdSpaceById,
  getHomeAdSpaces,
  searchAdSpaces,
  deleteAdSpace,
} from "../Controller/adspaceController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adspaceRouter = express.Router();

// Seller Routes
adspaceRouter.post("/", authMiddleware, adspacecontroller);
adspaceRouter.get("/my-advertisements", authMiddleware, adSpaceInfo);
adspaceRouter.put("/:id", authMiddleware, updateAdSpace);
adspaceRouter.patch("/:id/status", authMiddleware, toggleAdSpaceStatus);
adspaceRouter.delete("/:id", authMiddleware, deleteAdSpace);

// Public / Buyer Routes
adspaceRouter.get("/home", getHomeAdSpaces);
adspaceRouter.get("/search", searchAdSpaces);
adspaceRouter.get("/:id", getAdSpaceById);

export default adspaceRouter;