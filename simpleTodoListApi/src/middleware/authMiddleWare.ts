import jwt from 'jsonwebtoken'
import config from "../config/config";
import { NextFunction } from "express";
import { Response } from 'express';

export const verifyToken = (req:any,res:Response,next:NextFunction) => {
    try {    
        const token = req.cookies.token;
        if(!token){
            res.status(403).json({
                message:"No Token Provided"
            })
        }
        const decodeToken = jwt.verify(token,config.jwtSecret);
        // req.userData = decodeToken;
        next()
    } catch (error) {
        res.status(401).send({
            message:"Token is not valid"
        })
    }

};

