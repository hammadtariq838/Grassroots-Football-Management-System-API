import mongoose from "mongoose";
export * from './response.type'
export * from './request.type'

export type ROLE = "admin" | "coach" | "player";

export type User = {
  id: string,
  username: string,
  password: string,
  role: ROLE,
  isVerified: boolean,
}

export type Team = {
  name: string;
  coach: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
};

export type Game = {
  name: string;
  dateTime: Date;
  location: string;
  teams: mongoose.Types.ObjectId[];
};


export type Message = {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  message: string;
  dateTime: Date;
};

export type GameChannel = {
  gameId: mongoose.Types.ObjectId;
  messages: Message[];
};