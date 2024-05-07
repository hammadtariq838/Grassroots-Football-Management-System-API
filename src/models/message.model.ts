import mongoose from "mongoose";
import { Message } from "../types";

const messageSchema = new mongoose.Schema<Message>({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  dateTime: { type: Date, required: true },
}, { timestamps: true });

const MessageModel = mongoose.model<Message>('Message', messageSchema);

export default MessageModel;