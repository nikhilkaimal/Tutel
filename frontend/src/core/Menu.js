import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { signout, isAuthenticated } from '../auth';

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: '#ff9900' };
  else return { color: '#ffffff' };
};

const Menu = ({ history }) => (
  <div>
    <ul className='nav nav-tabs bg-primary'>
      <li className='nav-item'>
        <Link to='/' className='nav-link' style={isActive(history, '/')}>
          Home
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          to='/users'
          className='nav-link'
          style={isActive(history, '/users')}
        >
          Users
        </Link>
      </li>

      {!isAuthenticated() && (
        <>
          <li className='nav-item'>
            <Link
              to='/signin'
              className='nav-link'
              style={isActive(history, '/signin')}
            >
              Sign In
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/signup'
              className='nav-link'
              style={isActive(history, '/signup')}
            >
              Sign Up
            </Link>
          </li>
        </>
      )}

      {isAuthenticated() && (
        <>
          <li className='nav-item'>
            <Link
              to={'/post/create'}
              className='nav-link'
              style={isActive(history, '/post/create')}
            >
              Create Post
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to={'/findpeople'}
              className='nav-link'
              style={isActive(history, '/findpeople')}
            >
              Find People
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to={`/user/${isAuthenticated().user._id}`}
              className='nav-link'
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
          <li className='nav-item'>
            <button
              className='btn nav-link'
              style={
                (isActive(history, '/signup'),
                { cursor: 'pointer', color: '#ffffff' })
              }
              onClick={() => signout(() => history.push('/signin'))}
            >
              Sign Out
            </button>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
