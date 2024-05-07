import { Request } from "express";
import { ROLE } from "../types";
declare module "express-serve-static-core" {
  // interface User {
  //   id: string;
  //   name: string,
  //   username: string;
  //   role: ROLE
  // }
  interface Request {
    user?: {
      id: string;
      name: string;
      username: string;
      team?: {
        name: string;
        players: string[];
      };
    };
  }
}
