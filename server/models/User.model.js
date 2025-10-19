// This file is: server/models/User.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// This is the "schema" or blueprint for a User
const UserSchema = new mongoose.Schema(
  {
    // We'll require a username
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true, // Make sure usernames are unique
      trim: true,   // Remove whitespace
    },
    // And an email
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Make sure emails are unique
      lowercase: true,
      trim: true,
    },
    // And a password
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    // This adds "createdAt" and "updatedAt" timestamps
    timestamps: true,
  }
);

// --- Mongoose "Middleware" ---
// This function runs *before* a new user is saved
UserSchema.pre('save', async function (next) {
  // We only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // "Hash" the password with a "salt" (cost factor of 10)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// This adds a new method to our User model to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the "User" model from the schema
const User = mongoose.model('User', UserSchema);

export default User;