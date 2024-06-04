const express = require('express');
const { createUser, getUser, deleteUser, updateUser } = require('../services/userService');
const { loginUser } = require('../services/authService');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await createUser({ username, email, password });
    res.status(201).json({ success: true, userId: user.id });
  } catch (error) {
    console.error('Error registering new user:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error registering new user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser({ email, password });
    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in user:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error logging in user', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedUser = await updateUser(userId, updatedData);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteUser(req.params.id);
    if (success) {
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
