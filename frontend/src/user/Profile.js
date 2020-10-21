import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";

import { read } from "./apiUser";

import DefaultProfile from "../images/avatar.webp";

import DeleteUser from "./DeleteUser";

import Follow from "./Follow";

import ProfileTabs from "./ProfileTabs";

import { getPostsByUser } from "../post/apiPost";

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      following: false,
      posts: [],
      redirect: false,
      error: "",
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;

    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;

    this.init(userId);
  }

  init = (userId) => {
    const token = isAuthenticated().token;

    read(userId, token).then((data) => {
      if (data.error) this.setState({ redirect: true });
      else {
        let following = this.checkFollow(data);

        this.setState({
          user: data,
          following,
        });

        this.loadPosts(data._id);
      }
    });
  };

  checkFollow = (user) => {
    const jwt = isAuthenticated();

    const match = user.followers.find((follower) => {
      return follower._id === jwt.user._id;
    });

    return match;
  };

  follow = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else this.setState({ user: data, following: !this.state.following });
    });
  };

  loadPosts = (userId) => {
    const token = isAuthenticated().token;

    getPostsByUser(userId, token).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ posts: data });
    });
  };

  render() {
    const { redirect, user, posts } = this.state;

    if (redirect) return <Redirect to="/signin" />;

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>

        <div className="row">
          <div className="col-md-4">
            <img
              src={photoUrl}
              alt={user.name}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              className="img-thumbnail"
              style={{ height: "200px", width: "200px" }}
            />
          </div>
          <div className="col-md-8">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>{user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>

            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className="d-inline-block">
                <Link
                  to={`/post/create`}
                  className="btn btn-raised btn-info mr-5"
                >
                  Create Post
                </Link>
                <Link
                  to={`/user/edit/${user._id}`}
                  className="btn btn-raised btn-success mr-5"
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <Follow
                following={this.state.following}
                onButtonClick={this.follow}
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <ProfileTabs
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}
