import mongoose, { Document, Schema } from 'mongoose';
import connectToDatabase from '../db';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the model (or get it if it already exists)
const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);

// Helper functions
export const findUserByEmail = async (email: string): Promise<User | null> => {
  await connectToDatabase();
  return UserModel.findOne({ email }).exec();
};

export const findUserById = async (id: string): Promise<User | null> => {
  await connectToDatabase();
  return UserModel.findById(id).exec();
};

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<User> => {
  await connectToDatabase();
  const newUser = new UserModel(userData);
  return newUser.save();
};

export default UserModel;