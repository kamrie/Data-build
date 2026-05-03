import express from 'express';   // "type":"module" was set in package.json so as to be able to use import else we'd use require. 
// import bcryptjs from 'bcryptjs';
import cors from 'cors' ;
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.routes.js'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import './db.js';

dotenv.config(); //initializing it so it can be used


const app = express();

app.use(cors({
  origin: "http://localhost:5500", // or your frontend URL
  credentials: true
}));  // Enables CORS for all routes beacause If the frontend and backend are on different domains (even different ports), you might encounter CORS issues.-(Cross-Origin Resource Sharing)
app.use(express.json());
app.use(cookieParser());

app.listen(3500, () => {
    console.log("listening  3500!!!")
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

// app.post("/signup", ( req, res) => {
//     console.log(req.body)
// }) 


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message ||  'Internal server erroror'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message

    })
})
