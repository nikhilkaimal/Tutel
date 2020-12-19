import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { getPost, remove, like, unlike } from "./apiPost";

import DefaultPostImage from "../images/default_post_image.webp";

import { isAuthenticated } from "../auth";

import Comment from "./Comment";

export default class Post extends Component {
  state = {
    post: "",
    redirectToPosts: false,
    redirectToLogin: false,
    like: false,
    likes: 0,
    comments: [],
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;

    getPost(postId).then((data) => {
      if (data.error) console.log(data.error);
      else
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLiked(data.likes),
          comments: data.comments,
        });
    });
  };

  renderPost = (post) => {
    const authorId = post.author ? `/user/${post.author._id}` : "";
    const authorName = post.author ? post.author.name : "Unknown";

    const { like, likes } = this.state;

    return (
      <div className="card-body">
        <p className="font-italic mark">
          <Link to={`${authorId}`}>{authorName}</Link>
          <br />
          {new Date(post.created).toDateString()}
        </p>
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={(i) => (i.target.src = `${DefaultPostImage}`)}
          className="img-thumbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />

        {like ? (
          <div onClick={this.like}>
            <i className="fa fa-thumbs-up text-success" /> {likes} Likes
          </div>
        ) : (
          <div onClick={this.like}>
            <i className="fa fa-thumbs-up text-primary" /> {likes} Likes
          </div>
        )}

        <p className="card-text">{post.body}</p>
        <div class="d-inline-block">
          <Link to={`/`} className="btn btn-primary btn-raised btn-sm mr-5">
            Back to All Posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.author._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-warning btn-raised btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  class="btn btn-raised btn-danger"
                  onClick={this.confirmDelete}
                >
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };

  confirmDelete = () => {
    let confirm = window.confirm("Are you sure you want to delete this post ?");

    if (confirm) {
      this.deletePost();
    }
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;

    remove(postId, token).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ redirectToPosts: true });
    });
  };

  checkLiked = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;

    let match = likes.indexOf(userId) !== -1;

    return match;
  };

  like = () => {
    if (isAuthenticated()) {
      this.setState({ redirectToLogin: true });
      return false;
    }

    let callApi = this.state.like ? unlike : like;

    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.state.post._id;

    callApi(userId, token, postId).then((data) => {
      if (data.error) console.log(data.error);
      else
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
    });
  };

  updateComments = (comments) => {
    this.setState({ comments: comments });
  };

  render() {
    const { post, redirectToPosts, redirectToLogin, comments } = this.state;

    if (redirectToPosts) return <Redirect to={`/`} />;
    else if (redirectToLogin) return <Redirect to={`/signin`} />;

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
        {!post ? (
          <div className="jumbotron text-center">
            <h2>loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
