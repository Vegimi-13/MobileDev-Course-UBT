import express from "express";
//importet
import authRoutes from "./modules/auth/auth.routes";
import tripRoutes from "./modules/trip/trip.routes";
import userRoutes from "./modules/user/user.routes";
import photoRoutes from "./modules/photo/photo.routes";
import likeRoutes from "./modules/like/like.routes";
import followRoutes from "./modules/follow/follow.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import mediaRoutes from "./modules/media/media.routes";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/media", mediaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Api running" });
});

export default app;
