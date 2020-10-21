const express = require('express');

const {
  findUser,
  findAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
} = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

const router = express.Router();

router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

router.get('/users', requireSignin, findAllUsers);

router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.delete('/user/:userId', requireSignin, deleteUser);

router.get('/user/photo/:userId', getPhoto);

router.get('/user/findPeople/:userId', requireSignin, findPeople);

router.param('userId', findUser);

module.exports = router;
