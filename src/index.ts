import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './app';

(async () => {
  await mongoose.connect(process.env.MONGO_URI ? process.env.MONGO_URI : (() => { throw new Error('MONGO_URI is not defined') })())
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})()
