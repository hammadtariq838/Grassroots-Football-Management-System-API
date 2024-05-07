import { Request, Response, NextFunction } from 'express';
import { GameModel, UserModel } from '../models';
import { NAE } from '../error';
import mongoose from 'mongoose';
import { CreateGameResponse, GetAllGamesResponse, GetGameResponse, User } from '../types';

class GameController {

  // get all games
  static async getAllGames(_: Request, res: Response, next: NextFunction) {
    try {
      const games = await GameModel.find({})
      .populate<{
        teams: User[]
      }>([
        {
          path: 'teams',
          model: UserModel
        }
      ]);
      const response: GetAllGamesResponse = {
        success: true,
        message: 'Games found',
        games: games.map(game => ({
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          teams: game.teams.map(user => {
            return {
              coach: user.username,
              players: user.team ? user.team.players : [],
              name: user.team ? user.team.name : ''
            }
          })
        }))
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }


  // get a game by id
  static async getGameById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      const gameId = req.params.id;
      const game = await GameModel.findById(gameId)
      .populate<{
        teams: User[]
      }>([
        {
          path: 'teams',
          model: UserModel
        }
      ]);
      if (!game) {
        throw new NAE('Game not found');
      }
      const response: GetGameResponse  = {
        success: true,
        message: 'Game found',
        game: {
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          teams: game.teams.map(user => {
            return {
              coach: user.username,
              players: user.team ? user.team.players : [],
              name: user.team ? user.team.name : ''
            }
          })
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }


  // create a game
  static async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      const { name, dateTime, teams } = req.body;
      // name is non-empty string
      if (typeof name !== 'string' || name.length === 0) {
        throw new NAE('Name is required');
      }
      // dateTime is a valid date
      if (isNaN(new Date(dateTime).getTime())) {
        throw new NAE('Invalid date');
      }
      // teams is an array of valid and existing user ids
      if (!Array.isArray(teams) || teams.length === 0) {
        throw new NAE('Teams are required');
      }
      for (const teamId of teams) {
        const team = await UserModel.findById(teamId);
        if (!team) {
          throw new NAE('Team not found');
        }
        if (team.team === undefined) {
          throw new NAE('Some teams do not have a team');
        }
      }

      const game = new GameModel({
        name,
        dateTime,
        teams: teams.map(teamId => new mongoose.Types.ObjectId(teamId))
      });
      // push user to teams
      game.teams.push(new mongoose.Types.ObjectId(user.id));
      await game.save();

      const teamsPopulated = await GameModel.findById(game._id)
      .populate<{
        teams: User[]
      }>([
        {
          path: 'teams',
          model: UserModel
        }
      ]);
      if (!teamsPopulated) {
        throw new NAE('Game not found');
      }


      const response: CreateGameResponse  = {
        success: true,
        message: 'Game created',
        game: {
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          teams: teamsPopulated.teams.map(user => {
            return {
              coach: user.username,
              players: user.team ? user.team.players : [],
              name: user.team ? user.team.name : ''
            }
          })
        }
      }

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }


  


}


export default GameController;