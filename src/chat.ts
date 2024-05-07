import { Socket, Server as ioServer } from 'socket.io';
import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import { NAE } from './error';
import mongoose from 'mongoose';
import { GameModel, MessageModel } from './models';


function onlyForHandshake(middleware: express.RequestHandler) {
  return (req: any , res: any, next: any) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  }
}

type UserObject = {
  sockets: Socket[];
  id: string;
}
type UsersDict = {
  [key: string]: UserObject;
}






export const initSocketServer = (server: http.Server) => {
  const io = new ioServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.engine.use(onlyForHandshake((req: Request, _: Response, next: NextFunction) => {
    if (req.session.user) {
      req.user = req.session.user;
      next();
    } else {
      next(new NAE('Can not authenticate user. Please login.'));
    }
  }));


  let users: UsersDict = {};

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    const req = socket.request as Request;
    const user = req.user;
    if (!user) {
      throw new NAE('User not found');
    }
    let userObj = users[user.id];
    if (!userObj) {
      userObj = {
        sockets: [socket],
        id: user.id,
      };
      users[user.id] = userObj;
    } else {
      userObj.sockets.push(socket);
      users[user.id] = userObj;
    }


    socket.on('message', async (game: string, message: string, ack: any) => {
      try {
        // find the game such that the user is in the game
        const gameDoc = await GameModel.findOne({
          _id: new mongoose.Types.ObjectId(game),
          teams: {
            $in: [new mongoose.Types.ObjectId(user.id)]
          }
        });
        if (!gameDoc) {
          ack({ success: false, message: 'Game not found' });
          return;
        }
        // create a message for each user in the game
        for (const userId of gameDoc.teams) {
          const messageDoc = new MessageModel({
            from: new mongoose.Types.ObjectId(user.id),
            to: userId,
            message,
            dateTime: new Date(),
          });
          await messageDoc.save();
          // push the message to the game
          gameDoc.messages.push(messageDoc._id);
          // check if the user is online
          const userTo = users[userId.toString()];
          if (userTo) {
            userTo.sockets.forEach(socket => {
              socket.emit('new-message', gameDoc._id.toString(), {
                from: user.id.toString(),
                message,
                dateTime: messageDoc.dateTime,
              });
            });
          }
          await gameDoc.save();
          ack({ success: true, message: 'Message sent' });

        }
          
      } catch (e) {
        ack({ 
          success: false,
          message: 'An error occurred while sending the message',
          error: e 
        });
      }
    })


    // // Join a specific channel
    // socket.on('join channel', (channelName, user) => {
    //   socket.join(channelName);
    //   // console.log(${user} joined ${channelName});
    // });

    // // Listen for messages in a channel
    // socket.on(
    //   'chat message',
    //   (channelName, { msg, user, isTTS }) => {
    //     io.to(channelName).emit('chat message', {
    //       msg,
    //       user,
    //       isTTS,
    //       timestamp: new Date().toISOString(),
    //     });
    //   }
    // );

    socket.on('disconnect', () => {
      // remove the socket from the user object
      if (users[user.id]) {
        (users[user.id] as UserObject).sockets = (users[user.id] as UserObject).sockets.filter(s => s.id !== socket.id);
        if ((users[user.id] as UserObject).sockets.length === 0) {
          delete users[user.id];
        }
      }

      console.log('user disconnected');
    });
  });
};