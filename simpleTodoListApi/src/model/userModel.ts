import mongoose, { Document, Model } from "mongoose";


interface  userModel extends Document {
    name : string,
    password:string,
    todos:[string]
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User name is required']
    },
    password:{
        type:String,
        required:[true,'Password is Required']
    },
    todos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Todo'
    }]
});


const User:Model<userModel> = mongoose.model<userModel>('User',userSchema);
export default User;