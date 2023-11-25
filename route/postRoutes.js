import express from "express";
import {
  postCreate,
  getPost,
  getPosts,
  likeUnlikePost,
  deletePost,
  commentPost,
  getFeedPosts,
} from "../controller/postController.js";
import protectedRoute from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/feed", protectedRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:id", getPosts);
router.post("/create", protectedRoute, postCreate);
router.delete("/delete/:id", protectedRoute, deletePost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentPost);

export default router;
