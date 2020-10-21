import React, { Component } from 'react';

import { isAuthenticated } from '../auth';

import { remove } from './apiUser';

import { signout } from '../auth';
import { Redirect } from 'react-router-dom';

export default class DeleteUser extends Component {
  state = {
    redirect: false,
  };

  confirmDelete = () => {
    let confirm = window.confirm(
      'Are you sure you want to delete your account ?'
    );

    if (confirm) {
      this.deleteAccount();
    }
  };

  deleteAccount = () => {
    console.log('deleteAccount() called');
    const token = isAuthenticated().token;

    const userId = this.props.userId;

    remove(userId, token).then((data) => {
      if (data.error) console.log(data.error);
      else {
        signout(() => console.log('user deleted'));

        this.setState({ redirect: true });
      }
    });
  };

  render() {
    if (this.state.redirect) return <Redirect to='/' />;

    return (
      <>
        <button
          className='btn btn-danger btn-raised'
          onClick={this.confirmDelete}
        >
          Delete Profile
        </button>
      </>
    );
  }
}
