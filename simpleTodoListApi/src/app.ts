import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { authRouter, userRouter } from './routes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/*",(req,res) => {
    res.status(404).json({
        message:"path Not Found"
    })
}
)

const PORT  = 3001;
mongoose.connect('mongodb://localhost:27017/simpleTodo')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });
export default app;