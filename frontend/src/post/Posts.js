import React, { Component } from "react";
import { Link } from "react-router-dom";

import { isAuthenticated } from "../auth";

import { list } from "./apiPost";

import DefaultPostImage from "../images/default_post_image.webp";

export default class Posts extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const token = isAuthenticated().token;

    list(token).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ posts: data });
    });
  }

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const authorId = post.author ? `/user/${post.author._id}` : "";
          const authorName = post.author ? post.author.name : "Unknown";

          return (
            <div className="card col-md-4" key={i}>
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
                  style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 100)}</p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-primary btn-raised btn-sm"
                >
                  View Post
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{!posts.length ? "Loading..." : "Posts"}</h2>

        {this.renderPosts(posts)}
      </div>
    );
  }
}
