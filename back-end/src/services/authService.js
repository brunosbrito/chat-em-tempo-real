const {getUserByUsernameAndPassword} = require('../model/userModel');
const userModel = require('../model/userModel')

async function login(username, password) {
  const user = await getUserByUsernameAndPassword(username, password);
  return user;
}

async function register(username, password) {
  const user = await userModel.register(username, password)
  return user
}

async function getAll() {
  const users = await userModel.getAll();
  return users
}

module.exports = {
  login,
  register,
  getAll
};
