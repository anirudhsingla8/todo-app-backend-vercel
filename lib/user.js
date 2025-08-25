import bcrypt from 'bcrypt';
import { getModels } from './db.js';

// User methods
async function createUser(username, password) {
  try {
    const { User } = await getModels();
    
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedUser = await newUser.save();
    
    return {
      id: savedUser._id.toString(), // Convert ObjectId to string
      username: savedUser.username,
      password: savedUser.password, // This will be the hashed password
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      isVerified: savedUser.isVerified,
      failedLoginAttempts: savedUser.failedLoginAttempts
    };
  } catch (error) {
    throw error;
  }
}

async function findUserByUsername(username) {
  try {
    const { User } = await getModels();
    const user = await User.findOne({ username }).exec();
    
    if (!user) {
      return undefined;
    }
    
    return {
      id: user._id.toString(), // Convert ObjectId to string
      username: user.username,
      password: user.password,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      isVerified: user.isVerified,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil
    };
  } catch (error) {
    throw error;
  }
}

async function findUserById(id) {
  try {
    const { User } = await getModels();
    // Convert string ID back to ObjectId for MongoDB lookup
    const user = await User.findById(id).exec();
    
    if (!user) {
      return undefined;
    }
    
    return {
      id: user._id.toString(), // Convert ObjectId to string
      username: user.username,
      password: user.password,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
      isVerified: user.isVerified,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil
    };
  } catch (error) {
    throw error;
  }
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export { createUser, findUserByUsername, findUserById, comparePassword };