const { validationResult } = require("express-validator/check");

class postControllerClass {
  constructor(Post) {
    this.Post = Post;
  }
  getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = parseInt(process.env.PERPAGE);
    try {
      const totalItems = await this.Post.find().countDocuments();
      const posts = await this.Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);

      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  createPost = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error(
          "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        throw error;
      }
      const title = req.body.title;
      const content = req.body.content;
      const post = new this.Post({
        title: title,
        content: content,
      });

      const result = await post.save();

      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };


  updatePost = async (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    try {
      const post = await this.Post.findById(postId);

      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      const result = await post.save();

      res.status(200).json({ message: "Post updated!", post: result });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
      const post = await this.Post.findById(postId);
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      const result = await this.Post.findByIdAndRemove(postId);

      res.status(200).json({ message: "Deleted post." });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
}
module.exports = {
  postControllerClass,
};
