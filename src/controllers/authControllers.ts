import { Request, Response } from "express"
import { validationResult } from "express-validator"
import bcrypt from "bcryptjs";
import User from "../models/user";
import jwt from 'jsonwebtoken';

export const registerUser = async  (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({message: errors.array()});
        return
    }

    try {
        let user = await User.findOne({
            email: req.body.email,
        });

        if(user){
            res.status(400).json({message: "User already exists"});
            return;
        }

        user = new User(req.body);
        await user.save();

        res.status(200).json({message: "User Registered Successfully"});

    } catch(error){
        console.log(error);
        res.status(500).json({message: "Something Went Wrong"})
        return;
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({message:  errors.array()});
        return;
    }
    const {email, password} =  req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: "Invalid Credentials"});
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            res.status(400).json({message: "Invalid Credentials"});
            return;
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_TOKEN as string
        );

        res.status(200).json({token: token});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Something Went Wrong"});
    }

}