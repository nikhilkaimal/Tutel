import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { getPost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import DefaultPost from "../images/default_post_image.webp";

export default class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirect: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  componentDidMount() {
    this.postData = new FormData();

    const postId = this.props.match.params.postId;

    this.init(postId);
  }

  init = (postId) => {
    getPost(postId).then((data) => {
      if (data.error) this.setState({ redirect: true });
      else
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: data.error,
        });
    });
  };

  editPostForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Post Photo</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={this.handleChange("photo")}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={this.handleChange("title")}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Body</label>
        <textarea
          type="text"
          className="form-control"
          onChange={this.handleChange("body")}
          value={body}
        />
      </div>
      <button
        className="btn btn-raised btn-primary"
        onClick={this.handleSubmit}
      >
        Update Post
      </button>
    </form>
  );

  handleChange = (name) => (event) => {
    this.setState({ error: "" });

    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;

    this.postData.set(name, value);

    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (title.length === 0) {
      this.setState({ error: "Title is required.", loading: false });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: "Body is required.", loading: false });
      return false;
    }
    if (fileSize.length > 200000) {
      this.setState({
        error: "File size should be less than 100kb.",
        loading: false,
      });
      return false;
    }
    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            title: "",
            body: "",
            photo: "",
            loading: false,
            redirect: true,
          });
      });
    }
  };

  render() {
    const { id, title, body, redirect, error, loading } = this.state;

    if (redirect)
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <img
          src={`${
            process.env.REACT_APP_API_URL
          }/post/photo/${id}?${new Date().getTime()}`}
          alt={title}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          className="img-thumbnail"
          style={{ height: "200px", width: "200px" }}
        />
        {this.editPostForm(title, body)}
        {loading ? (
          <div className="jumbotron text-center">
            <h2>loading...</h2>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
