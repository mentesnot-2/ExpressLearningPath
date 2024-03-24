import {Request,Response} from 'express'
import { TodoSchema } from '../middleware/validation'
import Todo from '../model/todoModel';
import { TodoModel } from '../model/todoModel';
import User from '../model/userModel';

export const createTodo = async (req:any,res:Response) :Promise<void> => {
    
    try {
        const {error} = TodoSchema.validate(req.body);
        const {title} = req.body;
        const existingTodo = await Todo.findOne({title});
        if (existingTodo) {
            res.status(409).json({
                message:"Todo already exists"
            })
            return;
        }
        if (error) {
            res.status(400).json({error:error.details[0].message});
            return;
        }
        
        const userId = req.cookies.user_id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                message:"User not found"
            })
            return;
        }
        const todo = new Todo({
            ...req.body,
            userId:userId
        });
                
        
        const newTodo = await todo.save();
        
        res.status(201).json({
            newTodo
        })
        
    } catch (error) {
        res.status(500).json(
            {
                error,
            }
        )
    }
};


export const getTodo = async (req:any,res:Response) :Promise<void> => {
    try {
        const userId = req.cookies.user_id;
        const id = req.params.id
        const todo:TodoModel | null = await Todo.findOne({_id:id , userId:userId});

        if (!todo) {
            res.status(404).json({
                todo:" Todo Not Found"
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

export const getAllTodos = async (req:any,res:Response):Promise<void> => {
    try {
        const userId = req.cookies.user_id;
        const todos = await Todo.find({userId:userId});
        res.status(200).json({
            todos
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
};

export const deleteTodo = async (req:any,res:Response):Promise<void> => {
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
        const userId = req.cookies.user_id;
        if (todo.userId.toString() !== userId) {
            res.status(403).json({
                status:false,
                message:"You are not authorized to delete this todo"
            })
            return;
        }

        const deletedTodo =   await Todo.findByIdAndDelete(id);
        res.status(200).json({
            status:true,
            message:"Todo Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            message:'Something Went Wrong'
        })
    }
}

export const updateTodo = async (req:any,res:Response):Promise<void> => {
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
        const updatedFields: Partial<TodoModel> = {};
        if (req.body.title) updatedFields.title = req.body.title;
        if (req.body.description) updatedFields.description = req.body.description;
        if (req.body.completed !== undefined) updatedFields.completed = req.body.completed;

        const userId = req.cookies.user_id;
        if (todo.userId.toString() !== userId) {
            res.status(403).json({
                status:false,
                message:"You are not authorized to update this todo"
            })
            return;
        }
        const updatedTodo = await Todo.findByIdAndUpdate(id,updatedFields,{new:true});
        res.status(200).json({
            updatedTodo
        })
    } catch (error) {
        res.status(500).json({
            message:'Something Went Wrong'
        })
    }
}