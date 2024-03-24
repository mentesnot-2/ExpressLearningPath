import mongoose, { Document, Schema, Model } from "mongoose";

export interface TodoModel extends Document {
    title: string;
    description: string;
    completed: boolean;
    userId: mongoose.Types.ObjectId; // Reference to the user who created the todo
}

const todoSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide title for your todo']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user model
});

const Todo: Model<TodoModel> = mongoose.model<TodoModel>('Todo', todoSchema);
export default Todo;
