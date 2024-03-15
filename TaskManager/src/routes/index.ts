import { Router } from "express";
import { getAllTasks,deleteTask,updateTask,addTasks,getTaskById } from "../controller";

const router:Router = Router();
router.get('/tasks',getAllTasks);
router.post('/tasks',addTasks);
router.get('/tasks/:id',getTaskById);
router.patch('/tasks/:id',updateTask);
router.delete('/tasks/:id',deleteTask);

export default router;