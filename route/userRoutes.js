import express from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import {
  home,
  signUpUser,
  loginUser,
  signOutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getUserProfileId,
} from "../controller/userController.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/postprofile/:id", getUserProfileId);
router.post("/signup", signUpUser);
router.post("/signin", loginUser);
router.post("/signout", signOutUser);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.put("/update/:id", protectedRoute, updateUser);

export default router;
