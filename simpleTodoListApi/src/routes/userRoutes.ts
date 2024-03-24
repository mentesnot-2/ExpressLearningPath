import {createTodo,updateTodo,deleteTodo,getAllTodos,getTodo} from '../controller/todoController'
import express from 'express'
import { verifyToken } from '../middleware/authMiddleWare';
export const userRouter = express.Router();

userRouter.post('/todos',verifyToken,createTodo);
userRouter.get('/todos',verifyToken,getAllTodos);
userRouter.get('/todos/:id',verifyToken,getTodo);
userRouter.put('/todos/:id',verifyToken,updateTodo);
userRouter.delete('/todos/:id',verifyToken,deleteTodo);


