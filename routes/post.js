const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Create a post
router.post("/new", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const post = newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found." });
    }
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      res.status(200).json({ message: "Updated successfully." });
    } else {
      res.status(403).json({ message: "You can update your post only." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found." });
    }
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({ message: "Deleted successfully." });
    } else {
      res.status(403).json({ message: "You can update your post only." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like & Unlike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: { likes: req.body.userId },
      });
      res.status(200).json({ message: "The post has been liked." });
    } else {
      await post.updateOne({
        $pull: { likes: req.body.userId },
      });
      res.status(200).json({ message: "The post has been unliked." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post){
      return res.status(404).json({ message: "Post not found."});
    }
    res.status(200).json({post});
  } catch (error) {
    res.status(500).json(error);
  }
})

// Get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.query.userId);
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.followings.map(async (friendId) => {
        return Post.find({ userId: friendId});
      })
    );
    const allPosts = userPosts.concat(...friendPosts);
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;