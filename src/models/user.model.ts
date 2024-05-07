import mongoose from "mongoose";
import { User } from "../types";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isVerified: { type: Boolean, required: true },
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;