import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandlerMiddleWare';



const app = express();
app.use(bodyParser.json());
app.use('/api',router);

const PORT  = 3000;
mongoose.connect('mongodb://localhost:27017/simpleTodo')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });