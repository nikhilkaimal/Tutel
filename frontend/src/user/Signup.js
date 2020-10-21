import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { signup } from '../auth';

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      error: '',
      open: false,
    };
  }

  signupForm = (name, email, password) => (
    <form>
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
      <button
        className='btn btn-raised btn-primary'
        onClick={this.handleSubmit}
      >
        Submit
      </button>
    </form>
  );

  handleChange = (name) => (event) => {
    this.setState({ error: '', open: false });
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { name, email, password } = this.state;

    const user = {
      name,
      email,
      password,
    };

    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          name: '',
          email: '',
          password: '',
          error: '',
          open: true,
        });
    });
  };

  render() {
    const { name, email, password, error, open } = this.state;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Sign Up</h2>
        <div
          className='alert alert-info'
          style={{ display: open ? '' : 'none' }}
        >
          New Account is successfully created. Please proceed to{' '}
          <Link to='/signin'>Sign-In</Link>.
        </div>
        {this.signupForm(name, email, password)}
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
      </div>
    );
  }
}
