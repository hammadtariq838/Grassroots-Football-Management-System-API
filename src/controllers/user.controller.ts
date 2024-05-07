import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models';
import { BRE400, NAE } from '../error';
import { GetAllPlayersResponse, UserGetResponse, UserSigninResponse, UserSignoutResponse } from '../types';

class UserController {


  // sign up user static public method
  static async signUp(req: Request, _: Response, next: NextFunction) {
    try {
      const { username, password, role } = req.body;
      const userExists = await UserModel.findOne({ username });
      if (userExists) {
        throw new BRE400('User already exists');
      }
      if (role !== 'admin' && role !== 'coach' && role !== 'player') {
        throw new BRE400('Invalid role');
      }
      const newUser = new UserModel({ username, password, role, isVerified: false });
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
        role: user.role,
        // // isVerified: user.isVerified
      };
      const response: UserSigninResponse  = {
        success: true,
        message: 'User signed in successfully',
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          // // isVerified: user.isVerified
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

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new NAE('No User Found');
      }
      const response: UserGetResponse = {
        success: true,
        message: 'User found',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          // // isVerified: user.isVerified
        }
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }



  static async getAllPlayers(_: Request, res: Response, next: NextFunction) {
    try {
      const players = await UserModel.find({ role: 'player' });
      const response: GetAllPlayersResponse = {
        success: true,
        message: 'Players found',
        players: players.map(player => ({
          id: player._id.toString(),
          username: player.username,
          role: player.role as 'player',
          // // isVerified: player.isVerified
        }))
      }
      res.status(200).json(response);
    } catch (error) {
      next(error)
    }
  }


}


export default UserController;