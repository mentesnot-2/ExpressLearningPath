import { Response,Request } from "express";
import ITask from "../types/task";
import Task from "../models";
import { ResolveFnOutput } from "module";

const getAllTasks = async (req:Request,res:Response) :Promise<void> => {
    try {
        const tasks:ITask[] = await Task.find();
        res.status(200).json({
            tasks
        })
    } catch (error) {
        throw error
    }
    
};

const addTasks = async (req:Request,res:Response):Promise<void> => {
    try {
        console.log(req)
        const task:ITask = new Task({
            title:req.body.title,
            description:req.body.description,
            // status:req.body.status,
        });
        const newTask:ITask = await Task.create(task);
        res.status(200).json({
            newTask
        })
    } catch (error) {
        throw error
    }
    
};

const updateTask = async (req:Request,res:Response):Promise<void> => {
    try {
        const {params:{id},body} = req;
        const updatedtask:ITask | null = await Task.findByIdAndUpdate({_id:id},body);
        res.status(200).json({
            message:'Task updated successfully',
            Task:updatedtask,
        })
    } catch (error) {
        throw error
    }
};
const deleteTask = async (req:Request,res:Response):Promise<void> => {
    try {
        const deletedtask:ITask | null = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:'deleted successfully',
            data:deletedtask
        })
    } catch (error) {
        throw error
    }
};

const getTaskById = async (req:Request,res:Response):Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        res.status(200).json({
            message:'successfully found',
            data:task
        })
    } catch (error) {
        throw error
    }
}

export {deleteTask,updateTask,addTasks,getAllTasks,getTaskById}
