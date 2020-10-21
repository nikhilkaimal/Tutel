import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { isAuthenticated } from '../auth';

import { create } from './apiPost';

export default class NewPost extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      body: '',
      photo: '',
      fileSize: 0,
      author: {},
      loading: false,
      error: '',
      redirect: false,
    };
  }

  componentDidMount() {
    this.postData = new FormData();

    this.setState({ author: isAuthenticated().user });
  }

  newPostForm = (title, body) => (
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
        <label className='text-muted'>Title</label>
        <input
          type='text'
          className='form-control'
          onChange={this.handleChange('title')}
          value={title}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Body</label>
        <textarea
          type='text'
          className='form-control'
          onChange={this.handleChange('body')}
          value={body}
        />
      </div>
      <button
        className='btn btn-raised btn-primary'
        onClick={this.handleSubmit}
      >
        Create Post
      </button>
    </form>
  );

  handleChange = (name) => (event) => {
    this.setState({ error: '' });

    const value = name === 'photo' ? event.target.files[0] : event.target.value;

    const fileSize = name === 'photo' ? event.target.files[0].size : 0;

    this.postData.set(name, value);

    this.setState({ [name]: value, fileSize });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (title.length === 0) {
      this.setState({ error: 'Title is required.', loading: false });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: 'Body is required.', loading: false });
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
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            title: '',
            body: '',
            photo: '',
            loading: false,
            redirect: true,
          });
      });
    }
  };

  render() {
    const { title, body, author, loading, error, redirect } = this.state;

    if (redirect) return <Redirect to={`/user/${author._id}`} />;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Create a New Post</h2>

        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>

        {this.newPostForm(title, body)}

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
