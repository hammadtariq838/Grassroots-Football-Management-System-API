import { Request, Response, NextFunction } from "express";
import { TeamModel, UserModel } from "../models";
import mongoose from "mongoose";
import { CreateTeamResponse, DeleteTeamResponse, GetAllTeamsResponse, GetTeamResponse } from "../types";
import { NAE } from "../error";

class TeamController {

  
  static async getAllTeam(req: Request, res: Response, next: NextFunction) {
    try {
      // get the user from the request object
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      // check usre is a coach
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }


      const teams = await TeamModel.find({ coach: new mongoose.Types.ObjectId(user.id) });
      const response: GetAllTeamsResponse = {
        success: true,
        message: 'Teams found',
        teams: teams.map(team => ({
          id: team._id.toString(),
          name: team.name,
          coach: team.coach.toString(),
          players: team.players.map(player => player.toString())
        }))
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }

  static async getTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const teamId = req.params.id;
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }

      const team = await TeamModel.findOne({ _id: new mongoose.Types.ObjectId(teamId), coach: new mongoose.Types.ObjectId(user.id) });
      if (!team) {
        throw new NAE('Team not found');
      }
      const response: GetTeamResponse = {
        success: true,
        message: 'Team found',
        team: {
          id: team._id.toString(),
          name: team.name,
          coach: team.coach.toString(),
          players: team.players.map(player => player.toString())
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }


  static async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const { name, players } = req.body;
      // check name is non empty string
      if (!name || typeof name !== 'string') {
        throw new NAE('Name is required');
      }
      // check players is an array of string and each string is a valid object id and each player exists
      if (!Array.isArray(players) || players.length === 0) {
        throw new NAE('Players is required');
      }
      for (let i = 0; i < players.length; i++) {
        if (typeof players[i] !== 'string') {
          throw new NAE('Players is required');
        }
        if (!mongoose.Types.ObjectId.isValid(players[i])) {
          throw new NAE('Players is required');
        }
        const player = await UserModel.findOne({ _id: new mongoose.Types.ObjectId(players[i]) });
        if (!player) {
          throw new NAE('Player not found');
        }
      }
      


      const team = new TeamModel({
        name,
        coach: new mongoose.Types.ObjectId(user.id),
        players: players.map((player: string) => new mongoose.Types.ObjectId(player))
      });
      await team.save();
      const response: CreateTeamResponse = {
        success: true,
        message: 'Team created',
        team: {
          id: team._id.toString(),
          name: team.name,
          coach: team.coach.toString(),
          players: team.players.map(player => player.toString())
        }
      }
      res.status(201).json(response);
    } catch (error) {
      next(error)
    }
  }

  static async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const teamId = req.params.id;
      const { name, players } = req.body;
      const team = await TeamModel.findOne({ _id: new mongoose.Types.ObjectId(teamId), coach: new mongoose.Types.ObjectId(user.id) });
      if (!team) {
        throw new NAE('Team not found');
      }
      team.name = name;
      team.players = players.map((player: string) => new mongoose.Types.ObjectId(player));
      await team.save();
      const response: GetTeamResponse = {
        success: true,
        message: 'Team updated',
        team: {
          id: team._id.toString(),
          name: team.name,
          coach: team.coach.toString(),
          players: team.players.map(player => player.toString())
        }
      }
      res.status(200).json(response);

    } catch (error) {
      next(error)
    }
  }

  static async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const teamId = req.params.id;
      const team = await TeamModel.findOne({ _id: new mongoose.Types.ObjectId(teamId), coach: new mongoose.Types.ObjectId(user.id) });
      if (!team) {
        throw new NAE('Team not found');
      }
      const response: DeleteTeamResponse = {
        success: true,
        message: 'Team deleted',
        team: {
          id: team._id.toString(),
          name: team.name,
          coach: team.coach.toString(),
          players: team.players.map(player => player.toString())
        }
      }
      await TeamModel.deleteOne({ _id: new mongoose.Types.ObjectId(teamId) });
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }



}


export default TeamController;