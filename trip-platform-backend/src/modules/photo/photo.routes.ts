import { Router } from "express";
import * as controller from "./photo.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

router.post("/trip/:publicId", authenticate, controller.createPhoto);
router.get("/trip/:publicId", authenticate, controller.getTripPhotos);
router.delete("/:photoId", authenticate, controller.deletePhoto);

export default router;
