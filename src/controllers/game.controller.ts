import { Request, Response, NextFunction } from 'express';
import { GameModel } from '../models';
import { NAE } from '../error';
import mongoose from 'mongoose';
import { CreateGameResponse, DeleteGameResponse, GetAllGamesResponse, GetGameResponse, UpdateGameResponse } from '../types';

class GameController {

  // get all games
  static async getAllGames(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }


      const games = await GameModel.find({})
      const response: GetAllGamesResponse = {
        success: true,
        message: 'Games found',
        games: games.map(game => ({
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          location: game.location,
          teams: game.teams.map(team => team.toString())
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
      const game = await GameModel.findById(gameId);
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
          location: game.location,
          teams: game.teams.map(team => team.toString())
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
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const { name, dateTime, location, teams } = req.body;
      const game = await GameModel.create({
        name,
        dateTime,
        location,
        teams
      });
      const response: CreateGameResponse  = {
        success: true,
        message: 'Game created',
        game: {
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          location: game.location,
          teams: game.teams.map(team => team.toString())
        }
      }
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }


  // update a game
  static async updateGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const gameId = req.params.id;
      const { name, dateTime, location, teams } = req.body;
      const game = await GameModel.findById(gameId);
      if (!game) {
        throw new NAE('Game not found');
      }
      if (game.teams.some(team => !teams.includes(team.toString()))) {
        throw new NAE('Teams not found');
      }
      game.name = name;
      game.dateTime = dateTime;
      game.location = location;
      game.teams = teams;
      await game.save();
      const response: UpdateGameResponse  = {
        success: true,
        message: 'Game updated',
        game: {
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          location: game.location,
          teams: game.teams.map(team => team.toString())
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }


  // delete a game
  static async deleteGame(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('User not found');
      }
      if (user.role !== 'coach') {
        throw new NAE('User is not a coach');
      }
      const gameId = req.params.id;
      const game = await GameModel.findById(gameId);
      if (!game) {
        throw new NAE('Game not found');
      }
      await GameModel.deleteOne({ _id: new mongoose.Types.ObjectId(gameId) });
      const response: DeleteGameResponse  = {
        success: true,
        message: 'Game deleted',
        game: {
          id: game._id.toString(),
          name: game.name,
          dateTime: game.dateTime,
          location: game.location,
          teams: game.teams.map(team => team.toString())
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }



}


export default GameController;