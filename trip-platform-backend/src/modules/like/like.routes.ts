import { Router } from "express";
import * as controller from "./like.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/trips/:publicId", authenticate, controller.likeTrip);
router.delete("/trips/:publicId", authenticate, controller.unlikeTrip);
router.get("/trips/:publicId/status", authenticate, controller.getTripLikeStatus);

router.post("/photos/:photoId", authenticate, controller.likePhoto);
router.delete("/photos/:photoId", authenticate, controller.unlikePhoto);

export default router;
