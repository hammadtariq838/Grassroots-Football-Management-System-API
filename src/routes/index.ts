import { Router } from "express";
import userRoutes from "./user.routes";
import teamRoutes from "./team.routes";
import gameRoutes from "./game.routes";

const router = Router();

router.use('/user', userRoutes);
router.use('/team', teamRoutes);
router.use('/game', gameRoutes);

export default router;