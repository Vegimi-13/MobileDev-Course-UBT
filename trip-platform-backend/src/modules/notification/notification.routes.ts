import { Router } from "express";
import * as controller from "./notification.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.get("/me", authenticate, controller.getMyNotifications);
router.post("/push-token", authenticate, controller.registerPushToken);
router.delete("/push-token", authenticate, controller.unregisterPushToken);
router.patch("/:notificationId/read", authenticate, controller.markAsRead);
router.patch("/read-all", authenticate, controller.markAllAsRead);

export default router;
