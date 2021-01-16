import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import SocialLogin from "./SocialLogin";

import { signin, authenticate } from "../auth";

export default class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirect: false,
      loading: false,
    };
  }

  signinForm = (email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          className="form-control"
          onChange={this.handleChange("email")}
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={this.handleChange("password")}
          value={password}
        />
      </div>
      <button
        className="btn btn-raised btn-primary"
        onClick={this.handleSubmit}
      >
        Submit
      </button>
    </form>
  );

  handleChange = (name) => (event) => {
    this.setState({ error: "", open: false });
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });

    const { email, password } = this.state;

    const user = {
      email,
      password,
    };

    signin(user).then((data) => {
      if (data.error) this.setState({ error: data.error, loading: false });
      else {
        authenticate(data, () => {
          this.setState({ redirect: true });
        });
      }
    });
  };

  signin = (user) => {
    return fetch("http://localhost:8080/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        // console.log("res from http://localhost:8080/signin", res);
        return res.json();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { email, password, error, redirect, loading } = this.state;

    if (redirect) return <Redirect to="/" />;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Sign In</h2>

        <hr />
        <SocialLogin />
        <hr />

        {this.signinForm(email, password)}

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>loading...</h2>
          </div>
        ) : (
          ""
        )}

        <p>
          <Link to="/forgot-password" className="text-danger">
            {" "}
            Forgot Password
          </Link>
        </p>
      </div>
    );
  }
}
