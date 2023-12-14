import User from '../models/user.js'
import bcryptjs from 'bcryptjs'
import {errorHandler} from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next) => {
    const {username,email,password} = req.body;
    const hash = bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hash});
    // console.log(username,email,hash)
    try{
        await newUser.save()
        res.status(201).json("user created sucessfully");
    }
    catch(err){
        next();
    }
} 

export const signin = async (req,res,next) => {
    const {email,password} = req.body;
    try{
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404,"User Not Found"));
        const validPass = bcryptjs.compareSync(password,validUser.password);
        if(!validPass) return next(errorHandler(401,"Wrong Credentials"));
        const token = jwt.sign({id:validUser._id},'secret')
        const {password:pass,...rest} = validUser._doc;
        res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest)
    }
    catch(err){
        next(err);
    }
} 

export const google = async (req,res,next) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token = jwt.sign({id:user._id},'secret');
            const {password:pass,...rest} = user._doc;
            res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest)
        }
        else{
            const genpass =  Math.random().toString(36).slice(-8);
            const hash = bcryptjs.hashSync(genpass,10)
            const newUser = new User({username:req.body.name.split("").join("").toLowerCase()
                                +Math.random().toString(36).slice(-4),email:req.body.email,password:hash,avatar:req.body.photo});
            await newUser.save();
            const token = jwt.sign({id:newUser._id},'secret');
            const {password:pass,...rest} = newUser._doc;
            res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest)
        }
    }
    catch(err){
        next(err)
        console.log(err)
    }
}

export const signout = async (req, res, next) => {
    console.log("yes")
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };      