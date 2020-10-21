import React from 'react';
import Posts from '../post/Posts';

const Home = () => {
  return (
    <div>
      <div className='jumbotron'>
        <h2>Home</h2>
        <p className='lead'>Welcome</p>
      </div>
      <div className='container'>
        <Posts />
      </div>
    </div>
  );
};

export default Home;
