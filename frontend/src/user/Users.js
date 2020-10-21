import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { isAuthenticated } from '../auth';

import { list } from './apiUser';

import DefaultProfile from '../images/avatar.webp';

export default class Users extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const token = isAuthenticated().token;
    // console.log(token);

    list(token).then((data) => {
      if (data.error) console.log(data.error);
      else this.setState({ users: data });
    });
  }

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
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Users</h2>

        {this.renderUsers(users)}
      </div>
    );
  }
}
