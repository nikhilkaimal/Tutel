import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { isAuthenticated } from '../auth';

import { read, update, updateLocalStorage } from './apiUser';

import DefaultProfile from '../images/avatar.webp';

export default class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      about: '',
      fileSize: 0,
      loading: false,
      redirect: false,
      error: '',
    };
  }

  componentDidMount() {
    this.userData = new FormData();

    const userId = this.props.match.params.userId;

    this.init(userId);
  }

  init = (userId) => {
    const token = isAuthenticated().token;

    read(userId, token).then((data) => {
      if (data.error) this.setState({ redirect: true });
      else
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: data.error,
        });
    });
  };

  signupForm = (name, email, password, about) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          type='file'
          accept='image/*'
          className='form-control'
          onChange={this.handleChange('photo')}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          type='text'
          className='form-control'
          onChange={this.handleChange('name')}
          value={name}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          type='email'
          className='form-control'
          onChange={this.handleChange('email')}
          value={email}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          type='password'
          className='form-control'
          onChange={this.handleChange('password')}
          value={password}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>About</label>
        <textarea
          type='text'
          className='form-control'
          onChange={this.handleChange('about')}
          value={about}
        />
      </div>
      <button
        className='btn btn-raised btn-primary'
        onClick={this.handleSubmit}
      >
        Update
      </button>
    </form>
  );

  handleChange = (name) => (event) => {
    this.setState({ error: '' });

    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.userData.set(name, value);

    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (name.length === 0) {
      this.setState({ error: 'Name is required.', loading: false });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: 'A valid Email-Id is required.',
        loading: false,
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: 'Password must be at least 6 characters.',
        loading: false,
      });
      return false;
    }
    if (fileSize.length > 200000) {
      this.setState({
        error: 'File size should be less than 100kb.',
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
      const userId = this.props.match.params.userId;

      const token = isAuthenticated().token;

      update(userId, token, this.userData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          updateLocalStorage(data, () => {
            this.setState({
              redirect: true,
            });
          });
      });
    }
  };

  render() {
    const {
      id,
      name,
      email,
      password,
      about,
      loading,
      redirect,
      error,
    } = this.state;

    if (redirect) return <Redirect to={`/user/${id}`} />;

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit Profile</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        <img
          src={photoUrl}
          alt={name}
          onError={(i) => (i.target.src = `${DefaultProfile}`)}
          className='img-thumbnail'
          style={{ height: '200px', width: '200px' }}
        />

        {this.signupForm(name, email, password, about)}

        {loading ? (
          <div className='jumbotron text-center'>
            <h2>loading...</h2>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
