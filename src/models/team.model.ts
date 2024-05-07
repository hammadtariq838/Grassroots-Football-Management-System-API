import mongoose from "mongoose";
import { Team } from "../types";

const teamSchema = new mongoose.Schema<Team>({
  name: { type: String, required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const TeamModel = mongoose.model<Team>('Team', teamSchema);

export default TeamModel;