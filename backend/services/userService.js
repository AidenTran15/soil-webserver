const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createUser = async ({ username, email, password }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      dateJoined: new Date()
    });
    return user;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Username already exists');
    }
    console.error('Error creating user:', error);
    throw error;
  }
};

const getUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

const updateUser = async (id, updatedUserData) => {
  try {
    console.log('Finding user by ID:', id); 
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    console.log('User found:', user); 
    const updatedUser = await user.update(updatedUserData);
    console.log('User updated:', updatedUser); 
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


const deleteUser = async (id) => {
  try {
    const result = await User.destroy({
      where: { id }
    });
    return result > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser
};
