import mongoose from "mongoose";
import { User } from "../types";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  team: {
    type: {
      name: { type: String },
      players: [{ type: String }]
    },
    default: undefined
  },
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;