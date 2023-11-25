import Posts from "../model/postModel.js";
import User from "../model/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const postCreate = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let img = req.body.postImg;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "postedBy and text are required" });
    }
    const user = await User.findById({ _id: postedBy });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "your not authorised user to post" });
    }
    if (img) {
      const updateResponse = await cloudinary.uploader.upload(img);
      img = updateResponse.secure_url;
    }
    const newPost = new Posts({ postedBy, text, img });
    await newPost.save();
    return res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "error while postCreate " + err.message });
    console.log(err.message);
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById({ _id: id });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    return res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

const getPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Posts.find({ postedBy: id }).sort({ _id: -1 });
    // console.log(posts);

    if (!posts) {
      return res.status(404).json({ message: "post not found" });
    }
    return res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById({ _id: id });
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "your not authorised user to delete post" });
    }
    await Posts.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: "post deleted success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Posts.findById({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const userlikePost = post.likes.includes(userId);

    if (userlikePost) {
      await Posts.updateOne({ _id: id }, { $pull: { likes: userId } });
      return res.status(201).json({ message: "post unliked success" });
    } else {
      await Posts.updateOne({ _id: id }, { $push: { likes: userId } });
      return res.status(201).json({ message: "post liked success" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    const username = req.user.username;
    const profilePic = req.user.profilePic;
    if (!text) {
      return res.status(400).json({ message: "text field is required" });
    }

    const post = await Posts.findById({ _id: id });
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    const comment = { userId, userProfilePic: profilePic, username, text };
    post.comments.push(comment);
    await post.save();

    return res.status(201).json({ message: "comment add to post success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const following = user.following;
    const feedPosts = await Posts.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    return res.status(201).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
};

export {
  getPosts,
  postCreate,
  getPost,
  deletePost,
  likeUnlikePost,
  commentPost,
  getFeedPosts,
};
