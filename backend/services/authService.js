const bcrypt = require('bcryptjs');
const User = require('../models/user'); 

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return { id: user.id, email: user.email, username: user.username };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

module.exports = {
  loginUser
};
