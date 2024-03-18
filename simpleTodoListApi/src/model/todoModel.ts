 import mongoose, { Document, Schema,Model} from "mongoose";
 
 export interface TodoModel extends Document{
    // id: string;
    title: string;
    description: string;
    completed: boolean;
}

const todoSchema = new Schema({
    title:{
        type:String,
        required:[true,'Please provide title for you tot']
    },
    description:{
        type:String,
        required:[true,'description is required']
    },
    completed: { type: Boolean, default: false }
});

const Todo:Model<TodoModel> = mongoose.model<TodoModel>('Todo',todoSchema);
export default Todo;

// export default model<TodoModel>('todo',todoSchema);