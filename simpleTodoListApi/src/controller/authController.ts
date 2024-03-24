import config from '../config/config';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../model/userModel";
import { Request,Response } from 'express';


export const signup = async (req:Request,res:Response):Promise<void> => {
    try {
    

        const {name,password} = req.body;
        if (!name || !password) {
    
            res.status(400).json({message:"Invalid Input"})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            password:hashedPassword
        });
        const user = await User.findOne({name});
        if (user) {
            res.status(409).json({message:"User already exists"});
            return;
        }
        const newuser = User.create(newUser);
        res.status(200).json({
            message:"User Registered succesfully",
            data:newuser
        })
    } catch (error) {
        
    }
};


export const login = async (req:Request,res:Response):Promise<void> => {
    try {
        const {name,password} = req.body;
        if (!name || !password) {
    
            res.status(400).json({message:"Invalid Input"})
        }
        const user = await User.findOne({name});

        if (!user) {
            res.status(401).json({message:"Authentication failed"})

        } else {
            const validPassword = await bcrypt.compare(password,user.password);
            
            if (!validPassword) {
                res.status(401).json({message:"Authentication failed! Invalid Password"})
            }

            const token = jwt.sign({user_id:user._id},config.jwtSecret,{expiresIn:'1hr'})

            res.cookie('token',token,{httpOnly:true});
            res.cookie('user_id',user._id,{httpOnly:true})
            

            res.status(200).json({
                name,
                token
            });

        }
    } catch (error:any) {

        res.status(500).json({ error: error.message });

    }
    
}

