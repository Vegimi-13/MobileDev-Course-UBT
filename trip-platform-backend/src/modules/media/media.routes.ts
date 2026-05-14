import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import * as controller from "./media.controller";

const router = Router();

router.post("/cloudinary/signature", authenticate, controller.createCloudinarySignature);

export default router;
