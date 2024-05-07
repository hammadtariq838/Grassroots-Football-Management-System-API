import { Router } from "express";
import { UserController } from "../controllers";

const router = Router();

router.get('/', UserController.getUser);
router.post('/login', UserController.signIn);
router.post('/signup', UserController.signUp);
router.post('/logout', UserController.signOut);


export default router;