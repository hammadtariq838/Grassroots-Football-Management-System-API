import { Router } from "express";
import { UserController } from "../controllers";

const router = Router();

router.post('/login', UserController.signIn);
router.post('/signup', UserController.signUp, UserController.signIn);
router.post('/logout', UserController.signOut);

router.get('/', UserController.getAllUser);
router.get('/:id', UserController.getUserById);
router.post('/team', UserController.setTeam);


export default router;