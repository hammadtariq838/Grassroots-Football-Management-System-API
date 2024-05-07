import { Router } from "express";
import userRoutes from "./user.routes";
import gameRoutes from "./game.routes";

const router = Router();

router.use('/user', userRoutes);
router.use('/game', gameRoutes);

export default router;