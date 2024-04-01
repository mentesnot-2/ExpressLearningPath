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
        jwt.verify(token,config.jwtSecret,(err:any,decoded:any) => {
            if (err) {
                res.status(400).json({
                    message:"Invalid Token"
                });
            }
            req.user = {
                id:decoded.id,
                role:decoded.role
            }
        });
        
        next()
    } catch (error) {
        res.status(401).send({
            message:"Token is not valid"
        })
    }

};

