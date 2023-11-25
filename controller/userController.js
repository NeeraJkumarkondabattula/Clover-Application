import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import generateCookie from "../utils/helpers/generateCookie.js";
import { v2 as cloudinary } from "cloudinary";

const home = (req, res) => {
  res.send("hello");
};

const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in getUserProfile ${err.message}`);
    }
  }
};

const getUserProfileId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById({ _id: id })
      .select("-password")
      .select("-updatedAt");
    if (!user) {
      return res.status(400).json({ message: "user not found!" });
    }
    return res.status(200).json(user);
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in getUserProfileId ${err.message}`);
    }
  }
};

const signUpUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "user already existed!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (newUser) {
      generateCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User Details" });
    }
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in signUpUser ${err.message}`);
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const isPassword = await bcrypt.compare(password, user.password);
      if (isPassword) {
        generateCookie(user._id, res);
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePic: user.profilePic,
        });
      }
    }
    res.status(400).json({ message: "username or password is invalid!" });
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in signinUser ${err.message}`);
    }
  }
};

const signOutUser = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "user signout success" });
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById({ _id: id });
    const currentUser = await User.findById(req.user._id);

    if (id == req.user._id) {
      return res
        .status(400)
        .json({ message: "You can't follow and unfollow youself" });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({ message: "user not found!" });
    }
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      return res.status(201).json(userToModify);
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      console.log(User);
      return res.status(201).json(User);
    }
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in followUnfollow ${err.message}`);
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, username, email, password, bio } = req.body;
    let { profilePic } = req.body;
    // console.log(profilePic);
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    if (id !== userId.toString()) {
      return res
        .status(400)
        .json({ message: "you can't change others information" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const updateResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = updateResponse.secure_url;
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.password = hashedPassword || user.password;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
    user.email = email || user.email;

    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    if (err) {
      res.status(500).json({ message: err.message });
      console.log(`Error in updateUser ${err.message}`);
    }
  }
};

export {
  home,
  signUpUser,
  loginUser,
  signOutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getUserProfileId,
};
