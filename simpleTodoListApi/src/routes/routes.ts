import {createTodo,updateTodo,deleteTodo,getAllTodos,getTodo} from '../controller/todoController'
import express from 'express'

const router = express.Router();

router.post('/todos',createTodo);
router.get('/todos',getAllTodos);
router.get('/todos/:id',getTodo);
router.put('/todos/:id',updateTodo);
router.delete('/todos/:id',deleteTodo);


export default router;