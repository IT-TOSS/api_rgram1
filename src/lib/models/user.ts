import mongoose, { Document, Schema, Model } from 'mongoose';
import { hash, compare } from 'bcryptjs';

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema<User>(
  {
    username: { 
      type: String, 
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must be less than 30 characters']
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String, 
      required: true,
      minlength: [6, 'Password must be at least 6 characters']
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await hash(this.password, 10);
    this.password = salt;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create the model (or get it if it already exists)
const UserModel = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default UserModel;