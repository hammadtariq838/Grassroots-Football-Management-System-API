import { Router } from "express";
import { GameController } from "../controllers";


const router = Router();

router.route('/')
.get(GameController.getAllGames)
.post(GameController.createGame)

router.route('/:id')
.get(GameController.getGameById)
.put(GameController.updateGame)
.delete(GameController.deleteGame)



export default router;