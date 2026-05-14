import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

//ktu i kemi refresh tokenine dhe login
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);


export default router;