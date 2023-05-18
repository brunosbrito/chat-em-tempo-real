const { MongoClient } = require('mongodb');
const { updateUserStatus } = require('../controller/userController');
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'chat_db';

async function getUserByUsernameAndPassword(username, password) {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  const collection = db.collection('users');
  
  const user = await collection.findOne({ username, password });
  
  client.close();
  
  return user;
}


async function register(username, password) {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  const collection = db.collection('users');
  const user = await collection.insertOne({ username, password, status:'offline' });
  return user
}

async function getAll() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  const collection = db.collection("users");
  const users = await collection.find().toArray();

  client.close();

  return users;
}



module.exports = {
  getUserByUsernameAndPassword,
  register,
  getAll
};
