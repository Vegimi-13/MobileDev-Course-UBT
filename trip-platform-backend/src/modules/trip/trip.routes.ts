// trip.routes.ts
import { Router } from "express";
import * as controller from "./trip.controller";
import { authenticate } from "../../middleware/authenticate";


const router = Router();

router.post("/", authenticate, controller.createTrip);
router.get("/public", controller.getPublicTrips);
router.get("/me", authenticate, controller.getMyTrips);
router.get("/:publicId/requests", authenticate, controller.getPendingJoinRequests);
router.get("/:publicId/posts", authenticate, controller.getTripPosts);
router.post("/:publicId/posts", authenticate, controller.createTripPost);
router.post("/:publicId/invites", authenticate, controller.inviteUserToTrip);
router.patch("/:publicId/invites/accept", authenticate, controller.acceptTripInvite);
router.patch("/:publicId/invites/decline", authenticate, controller.declineTripInvite);
router.patch(
  "/:publicId/participants/:userId/approve",
  authenticate,
  controller.approveJoinRequest,
);
router.patch(
  "/:publicId/participants/:userId/decline",
  authenticate,
  controller.declineJoinRequest,
);
router.post("/:publicId/join", authenticate, controller.joinTrip);
router.get("/:publicId", controller.getTripByPublicId);

export default router;
