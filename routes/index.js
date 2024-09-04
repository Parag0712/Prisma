import { Router } from "express";
import UserRoutes from "./userRoute.js";
import CommentRoutes from "./commentRoute.js";
import PostRoutes from "./postRoute.js";
const router = Router();

router.use("/api/user", UserRoutes);

// * For Post Routes
router.use("/api/post", PostRoutes);

// * For Post Routes
router.use("/api/comment", CommentRoutes);

export default router;