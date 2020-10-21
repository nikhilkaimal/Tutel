import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { isAuthenticated } from '../auth';

import { findPeople, follow } from './apiUser';

import DefaultProfile from '../images/avatar.webp';

export default class FindPeople extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      followMsg: '',
      showFollowMsg: false,
      error: '',
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ users: data });
    });
  }

  followSuggested = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    follow(userId, token, user._id).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else {
        let updatedSuggestions = this.state.users;
        updatedSuggestions.splice(i, 1);

        this.setState({
          users: updatedSuggestions,
          followMsg: `Following ${user.name}`,
          showFollowMsg: true,
        });
      }
    });
  };

  renderUsers = (users) => (
    <div className='row'>
      {users.map((user, i) => (
        <div className='card col-md-4' key={i}>
          <img
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            alt={user.name}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            className='img-thumbnail'
            style={{ height: '200px', width: '200px' }}
          />
          <div className='card-body'>
            <h5 className='card-title'>{user.name}</h5>
            <p className='card-text'>{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className='btn btn-primary btn-raised btn-sm'
            >
              View Profile
            </Link>

            <button
              className='btn btn-raised btn-info float-right btn-sm'
              onClick={() => this.followSuggested(user, i)}
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, followMsg, showFollowMsg } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Suggested People</h2>
        {showFollowMsg && (
          <div className='alert alert-success'>
            {showFollowMsg && <p>{followMsg}</p>}
          </div>
        )}

        {this.renderUsers(users)}
      </div>
    );
  }
}
