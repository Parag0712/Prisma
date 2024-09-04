import { Router } from "express";
import {
    getComment,createComment,deleteComment,getAllComments
} from "../Controllers/CommentController.js";


const router = Router();

router.get("/", getAllComments);
router.get("/:id", getComment);
router.post("/", createComment);
router.delete("/", deleteComment);

export default router;