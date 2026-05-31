import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Get current authenticated user profile
router.get("/me", authenticate, controller.getCurrentUser);
router.patch("/me", authenticate, controller.updateCurrentUserProfile);
router.get("/search", authenticate, controller.searchUsers);
router.get("/username/:username", controller.getProfileByUsername);

// Get user profile by ID
router.get("/:userId", controller.getProfile);

// Update user profile (requires authentication)
router.put("/:userId", authenticate, controller.updateProfile);

export default router;
