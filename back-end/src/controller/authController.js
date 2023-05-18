const authService = require('../services/authService');

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await authService.login(username, password);
    
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function register(req, res) {
  const { username, password } = req.body;

  try {
    const user = await authService.register(username, password);

    if (user) {
      res.status(200).json({ message: 'Register successful' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAll(req, res) {
  try {
    const users = await authService.getAll();
    console.log(users)
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(401).json({ message: 'not users' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  login,
  register,
  getAll
};
