import { Request, Response, NextFunction } from "express";
import { MessageModel, GameChannelModel } from "../models";

class MessageController {

  // get all messages of a game channel
  static async getChannelAndMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
    } catch (error) {
      next(error);
    }
  }  



}


export default MessageController;
