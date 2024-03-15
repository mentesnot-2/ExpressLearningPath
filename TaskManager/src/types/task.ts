import {Document} from "mongoose"

export default interface ITask extends Document {
    title:string,
    description:string,
    status:string,
    createdAt:Date,
    updatedAt:Date
}