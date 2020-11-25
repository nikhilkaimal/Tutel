import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./auth/PrivateRoute";

import Home from "./core/Home";
import Menu from "./core/Menu";

import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import Users from "./user/Users";
import FindPeople from "./user/FindPeople";

import NewPost from "./post/NewPost";
import Post from "./post/Post";
import EditPost from "./post/EditPost";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />

      <PrivateRoute exact path="/" component={Home} />

      <PrivateRoute exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />

      <PrivateRoute exact path="/users" component={Users} />

      <PrivateRoute exact path="/findpeople" component={FindPeople} />

      <PrivateRoute exact path="/post/create" component={NewPost} />
      <PrivateRoute exact path="/post/:postId" component={Post} />
      <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
    </Switch>
  </div>
);

export default MainRouter;
