import mongoose from "mongoose";
import { GameChannel } from "../types";

const gameChannelSchema = new mongoose.Schema<GameChannel>({
  gameId: { type: mongoose.Schema.Types.ObjectId, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const GameChannelModel = mongoose.model<GameChannel>('GameChannel', gameChannelSchema);

export default GameChannelModel;