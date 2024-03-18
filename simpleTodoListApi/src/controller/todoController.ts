import {Request,Response} from 'express'
import { TodoSchema } from '../middleware/validation'
import Todo from '../model/todoModel';
import { TodoModel } from '../model/todoModel';

export const createTodo = async (req:Request,res:Response) :Promise<void> => {
    try {
        console.log(req.body)
        const {error} = TodoSchema.validate(req.body);

        if (error) {
            res.status(400).json({error:error.details[0].message});
            return;
        }

        const todo = await Todo.create(req.body)
        res.status(201).json(todo)
    } catch (error) {
        res.status(500).json(
            error
        )
    }
};

export const getTodo = async (req:Request,res:Response) :Promise<void> => {
    try {
        const id = req.params.id
        const todo = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({
                todo:"Not Found"
            });
            return
        }
        res.status(200).json({
            todo
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
};

export const getAllTodos = async (req:Request,res:Response):Promise<void> => {
    try {
        const todos = await Todo.find();
        res.status(200).json({
            todos
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
};

export const deleteTodo = async (req:Request,res:Response) :Promise<void> => {
    try {
        const id = req.params.id
        const todo = await Todo.findByIdAndDelete(id);
        res.status(200).json({
            todo
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
};

export const updateTodo = async (req:Request,res:Response):Promise<void> => {
    try {
        const id = req.params.id
        const todo:TodoModel | null = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({
                status:false,
                message:"Todo not found"
            })
            return;
        }
        const newTodo = {title:todo.title,description:todo.description,completed:todo.completed,...req.body};
        const updatedTodo = await Todo.findByIdAndUpdate(id,newTodo);
        res.status(200).json({
            updatedTodo
        })
    } catch (error) {
        res.status(500).json({
            message:'Something Went Wrong'
        })
    }
}