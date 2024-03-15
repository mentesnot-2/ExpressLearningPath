import ITask from '../types/task'
import mongoose, { Mongoose, Schema, Model
 } from 'mongoose'

const taskSchema:Schema<ITask> = new Schema({
    title:{
        type:String,
        required:[true,'Please provided the title for your task']
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum: ['pending', 'in progress', 'completed'],
        default:'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
});

taskSchema.pre<ITask>('save',function(nxt) {
    this.updatedAt = new Date();
    nxt()
});

const Task:Model<ITask> = mongoose.model<ITask>('Task',taskSchema);
export default Task