const express = require("express");
const { body } = require("express-validator/check");

const { postControllerClass } = require("../controllers/posts");
const Post = require("../models/post");
let postController = new postControllerClass(Post);
const router = express.Router();

// GET /posts
router.get("/", postController.getPosts);

//POST /posts
router.post(
  "/",

  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 3 }),
  ],
  postController.createPost
);


router.put(
  "/post/:postId",

  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 3 }),
  ],
  postController.updatePost
);

router.delete("/post/:postId", postController.deletePost);

module.exports = router;
