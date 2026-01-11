import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const email = 'admin@mail.com';
const user = await User.findOne({ email });

if (!user) {
  console.log('User not found');
  process.exit();
}

user.role = 'admin';
await user.save();
console.log('User is now admin');

process.exit();
