import { Router } from "express";
import { TeamController } from "../controllers";

const router = Router();

router.route('/')
.get(TeamController.getAllTeam)
.post(TeamController.createTeam)




router.route('/:id')
.get(TeamController.getTeamById)
.put(TeamController.updateTeam)
.delete(TeamController.deleteTeam)


export default router;