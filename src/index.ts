import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { initSocketServer } from './chat';
import http from 'http';


(async () => {
  await mongoose.connect(process.env.MONGO_URI ? process.env.MONGO_URI : (() => { throw new Error('MONGO_URI is not defined') })())
  const port = 5000;
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  initSocketServer(server);
})()
