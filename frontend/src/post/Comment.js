import React, { Component } from "react";
import { Link } from "react-router-dom";

import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";

import DefaultProfile from "../images/avatar.webp";

export default class Comment extends Component {
  state = { text: "", error: "" };

  handleChange = (event) => {
    this.setState({
      error: "",
      text: event.target.value,
    });
  };

  isValid = () => {
    const { text } = this.state;

    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "comment should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  addComment = (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please signin to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) console.log(data.error);
        else {
          this.setState({ text: "" });

          this.props.updateComments(data.comments);
        }
      });
    }
  };

  confirmDelete = (comment) => {
    let confirm = window.confirm(
      "Are you sure you want to delete your comment ?"
    );

    if (confirm) {
      this.deleteComment(comment);
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) console.log(data.error);
      else this.props.updateComments(data.comments);
    });
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className="mt-5 mb-5">Comments</h2>

        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              placeholder="leave a comment..."
              className="form-control"
              value={this.state.text}
              onChange={this.handleChange}
            />
            <button class="btn btn-raised btn-success mt-2">Comment</button>
          </div>
        </form>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12">
          <h3 className="text-primary">{comments.length} Comments</h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.author._id}`}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.author._id}`}
                    alt={comment.author.name}
                    className="float-left mr-2"
                    style={{
                      borderRadius: "50%",
                      border: "1px solid black",
                      height: "30px",
                      width: "30px",
                    }}
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  />
                </Link>
                <div>
                  <p className="font-italic mark">
                    <Link to={`/user/${comment.author._id}`}>
                      {comment.author.name}
                    </Link>
                    <br />
                    {new Date(comment.created).toDateString()}
                  </p>
                  <p className="lead">
                    {comment.text}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.author._id && (
                          <>
                            <button
                              class="btn btn-raised btn-danger float-right mr-1"
                              onClick={() => this.confirmDelete(comment)}
                            >
                              Remove Comment
                            </button>
                          </>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
