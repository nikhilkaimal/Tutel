import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { getPost, remove } from "./apiPost";

import DefaultPostImage from "../images/default_post_image.webp";

import { isAuthenticated } from "../auth";

export default class Post extends Component {
  state = {
    post: "",
    redirectToPosts: false,
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;

    getPost(postId).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ post: data });
    });
  };

  renderPost = (post) => {
    const authorId = post.author ? `/user/${post.author._id}` : "";
    const authorName = post.author ? post.author.name : "Unknown";

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
        <p className="card-text">{post.body}</p>
        <div class="d-inline-block">
          <Link to={`/`} className="btn btn-primary btn-raised btn-sm mr-5">
            Back to All Posts
          </Link>
          {isAuthenticated().user &&
            isAuthenticated().user._id === post.author._id && (
              <>
                <button class="btn btn-raised btn-info mr-5">
                  Update Post
                </button>
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

  render() {
    const { post, redirectToPosts } = this.state;

    if (redirectToPosts) return <Redirect to={`/`} />;

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
      </div>
    );
  }
}
