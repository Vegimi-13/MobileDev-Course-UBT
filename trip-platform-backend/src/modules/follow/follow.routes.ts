import { Router } from "express";
import * as controller from "./follow.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/:userId", authenticate, controller.followUser);
router.delete("/:userId", authenticate, controller.unfollowUser);
router.get("/:userId/followers", controller.getFollowers);
router.get("/:userId/following", controller.getFollowing);

export default router;
