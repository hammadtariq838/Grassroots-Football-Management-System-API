import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models';
import { BRE400, NAE } from '../error';
import { User, UserGetAllResponse, UserGetByIdResponse, UserResponse, UserSigninResponse, UserSignoutResponse } from '../types';

class UserController {


  // sign up user static public method
  static async signUp(req: Request, _: Response, next: NextFunction) {
    try {
      const { username, password, name } = req.body;
      const userExists = await UserModel.findOne({ username });
      if (userExists) {
        throw new BRE400('User already exists');
      }
      const newUser = new UserModel<User>({
        name, 
        username, 
        password,
      });
      await newUser.save();
      next();
    } catch (error) {
      next(error)
    }
  }


  // sign in user static public method
  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({
        username,
        password
      });
      if (!user) {
        throw new BRE400('Invalid credentials');
      }
      req.session.user = {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
      };
      const response: UserSigninResponse  = {
        success: true,
        message: 'User signed in successfully',
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          team: user.team ? {
            name: user.team.name,
            players: user.team.players
          } : undefined
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }


  // sign out user static public method
  static async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((error) => {
        if (error) {
          throw error;
        }
        const response: UserSignoutResponse = {
          success: true,
          message: 'User signed out successfully'
        }
        res.status(200).json(response);
      });
    } catch (error) {
      next(error)
    }
  }

  static async getAllUser(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserModel.find();
      const response: UserGetAllResponse = {
        success: true,
        message: 'User found',
        users: users.map(user => ({
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          team: user.team ? {
            name: user.team.name,
            players: user.team.players
          } : undefined
        }))
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }


  // get user by id
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        throw new NAE('User not found');
      }
      const response: UserGetByIdResponse = {
        success: true,
        message: 'User found',
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          team: user.team ? {
            name: user.team.name,
            players: user.team.players
          } : undefined
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }


  // create team
  static async setTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, players } = req.body;
      const user = req.session.user;
      if (!user) {
        throw new NAE('User not signed in');
      }

      // name is non empty string
      if (!name || typeof name !== 'string') {
        throw new BRE400('Invalid team name');
      }
      /// players is an array of strings
      if (!players || !Array.isArray(players) || players.some(player => typeof player !== 'string')) {
        throw new BRE400('Invalid players');
      }


      const updatedUser = await UserModel.findByIdAndUpdate(user.id, {
        team: {
          name,
          players
        }
      }, { new: true });
      if (!updatedUser) {
        throw new NAE('User not found');
      }
      const response: UserResponse = {
        success: true,
        message: 'Team created successfully',
        user: {
          id: updatedUser._id.toString(),
          username: updatedUser.username,
          name: updatedUser.name,
          team: updatedUser.team ? {
            name: updatedUser.team.name,
            players: updatedUser.team.players
          } : undefined
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }
}


export default UserController;