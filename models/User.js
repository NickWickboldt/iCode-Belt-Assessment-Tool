// /models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  // ... your entire schema definition from the prompt goes here ...
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function () { return !this.googleId; },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  // etc...
});

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // It's important to check if a password exists for the user (e.g., Google users)
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// This is the critical change:
// It prevents Mongoose from recompiling the model on every hot-reload
export default mongoose.models.User || mongoose.model('User', UserSchema);