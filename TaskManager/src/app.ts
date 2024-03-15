import express,{ Express } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import router from "./routes";
import bodyParser from 'body-parser'
const app:Express =express();

app.use(cors());
app.use(bodyParser.json())
app.use(router)

const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/TaskManager').then(() => {
    app.listen(PORT,() => {
        console.log(`Server is runnin on port ${PORT} `)
    })
}).catch(error => {
    throw error
})