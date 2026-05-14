import { Router } from "express";
import * as controller from "./user.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Get current authenticated user profile
router.get("/me", authenticate, controller.getCurrentUser);

// Get user profile by ID
router.get("/:userId", controller.getProfile);

// Get user profile by username
router.get("/username/:username", controller.getProfileByUsername);

// Update user profile (requires authentication)
router.put("/:userId", authenticate, controller.updateProfile);

export default router;
