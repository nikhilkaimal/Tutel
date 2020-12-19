const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

const Post = require("../models/post");

exports.findPostById = (req, res, next, id) => {
  Post.findById(id)
    .populate("author", "_id name")
    .exec((err, post) => {
      if (err || !post) res.status(400).json({ error: err });

      req.post = post;

      next();
    });
};

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("author", "_id name")
    .select("_id title body created likes")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res) => {
  return res.json(req.post);
};

exports.createPost = async (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  console.log("form", form);

  form.parse(req, (err, fields, files) => {
    console.log("fields", fields);
    console.log("files", files);

    if (err)
      return res.status(400).json({ error: "image could not be uploaded" });

    let post = new Post(fields);

    req.profile.salt = undefined;
    req.profile.hashed_password = undefined;

    post.author = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err) return res.status(400).json({ error: err });

      res.json(result);
    });
  });
};

exports.findPostsByUser = (req, res) => {
  Post.find({ author: req.profile._id })
    .populate("author", "_id name")
    .select("_id title body created likes")
    .sort("created")
    .exec((err, posts) => {
      if (err) return res.status(400).json({ error: err });

      console.log(posts);
      res.json(posts);
    });
};

exports.isAuthor = (req, res, next) => {
  let isAuthor = req.post && req.auth && req.post.author._id == req.auth._id;

  if (!isAuthor) return res.status(403).json({ error: "unauthorized" });

  next();
};

// exports.updatePost = (req, res) => {
//   let post = req.post;
//   post = _.extend(post, req.body);

//   post.updated = Date.now();

//   post.save((err) => {
//     if (err) return res.status(400).json({ error: err });

//     res.json(post);
//   });
// };

exports.updatePost = (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err)
      return res.status(400).json({
        error: "photo could not be uploaded",
      });

    let post = req.post;

    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }

    post.save((err, result) => {
      if (err)
        return res.status(400).json({
          error: err,
        });

      res.json({ post });
    });
  });
};

exports.deletePost = (req, res) => {
  let post = req.post;

  post.remove((err) => {
    if (err) return res.status(400).json({ error: err });

    res.json({ message: "post deleted successfully" });
  });
};

exports.getPhoto = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);

  return res.send(req.post.photo.data);
};

exports.like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.body.userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(400).json({ errpr: err });
    else res.json(result);
  });
};

exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.body.userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(400).json({ errpr: err });
    else res.json(result);
  });
};
