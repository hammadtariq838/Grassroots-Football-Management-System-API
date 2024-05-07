import mongoose from "mongoose";
import { Game } from "../types";

const gameSchema = new mongoose.Schema<Game>({
  name: { type: String, required: true },
  dateTime: { type: Date, required: true },
  teams: [{ type: mongoose.Schema.Types.ObjectId , ref: 'User', required: true }],
}, { timestamps: true });


const GameModel = mongoose.model<Game>('Game', gameSchema);

export default GameModel;