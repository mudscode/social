const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Update a User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update your account only.");
  }
});

// Delete a User
router.delete("/:id", async (req, res) => {
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.body.userId);
      res.status(200).json(deletedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete your account only.");
  }
});

// Get a User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Follow a User
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(currentUser)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user.");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself.");
  }
});

// Unfollow a User
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
            $pull: {followers: req.body.userId}
        });
        await currentUser.updateOne({
            $pull: { followings: req.params.id }
        });
        res.status(200).json("User has been unfollowed.");
      } else{
        res.status(403).json("You don't follow this user.");
      }
    } catch (error) {
        res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself.");
  }
});

module.exports = router;