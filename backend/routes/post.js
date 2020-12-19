const express = require("express");

const {
  getPosts,
  getPost,
  createPost,
  findPostsByUser,
  findPostById,
  isAuthor,
  updatePost,
  deletePost,
  getPhoto,
  like,
  unlike,
  comment,
  uncomment,
} = require("../controllers/post");

const { createPostValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
const { findUser } = require("../controllers/user");

const router = express.Router();

router.get("/posts", getPosts);
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);
router.get("/posts/by/:userId", requireSignin, findPostsByUser);
router.get("/post/:postId", getPost);
router.put("/post/:postId", requireSignin, isAuthor, updatePost);
router.delete("/post/:postId", requireSignin, isAuthor, deletePost);
router.get("/post/photo/:postId", getPhoto);

router.param("userId", findUser);
router.param("postId", findPostById);

module.exports = router;
