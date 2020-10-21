import React, { Component } from 'react';

import { follow, unfollow } from './apiUser';

export default class Follow extends Component {
  follow = () => {
    this.props.onButtonClick(follow);
  };

  unfollow = () => {
    this.props.onButtonClick(unfollow);
  };

  render() {
    return (
      <div className='d-inline-block mt-5'>
        {!this.props.following ? (
          <button
            className='btn btn-success btn-raised mr-5'
            onClick={this.follow}
          >
            Follow
          </button>
        ) : (
          <button
            className='btn btn-warning btn-raised'
            onClick={this.unfollow}
          >
            Unfollow
          </button>
        )}
      </div>
    );
  }
}
