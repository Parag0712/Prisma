import { Router } from "express";
import {
    createPost,deletePost,getAllPosts,searchPost,getPost,updatePost
} from "../Controllers/PostController.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/search", searchPost);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;