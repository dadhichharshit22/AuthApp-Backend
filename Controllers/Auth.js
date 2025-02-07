const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// SignUp Route Handler
exports.signup = async (req,res) =>{
    try{
    // get data
    const {name,email,password,role} = req.body;
    // check if User already exist 
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User Already Exists'
        });
    }

    // secure Password
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password,10);
    }
    catch(error){
        return res.status(500).json({
            success:false ,
            message:'Error in hashing Password'
        });
    }

    // create a entry for User
    const user = await User.create({
        name,email,password:hashedPassword,role
    })
    return res.status(200).json({
        success:true,
        message:'user Created Successfully',
    });
}
    catch(error){
     console.error(error);
     return res.status(500).json({
        success:false,
        message:'user cannot be registered, please try again later',
     })
    }
}

// login
exports.login = async(req,res) =>{
    try{
     // data fetch
     const {email,password} = req.body;
     // validation on email and password
     if(!email || !password){
        return res.status(400).json({
            success:false,
            message:'Please fill all the details carefully',
        });
     }
     // check for registered User
     let user = await User.findOne({email});
     // if not a registered User
     if(!user){
        return res.status(400).json({
            success:false,
            message:'User is not registered'
        });
     }
     const payload = {
        email:user.email,
        id:user._id,
        role:user.role,
     };
     // verify password and generate a JWT Token
     if(await bcrypt.compare(password,user.password)){
         // password match
        let token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });

        // const oldUser = {...user,token};
        // oldUser.password = undefined;

        user = user.toObject();
        user.token = token;
        user.password = undefined;
        const options = {
         expires:new Date(Date.now() + 3*24*60*60*1000),
         httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'User Logged in Successfully',
        })
     }
    
     else{
        // password do not match
        return res.status(403).json({
            success:false,
            message:'Password Incorrect',
        });
     }

    }
    catch(error){
     console.log(error);
     return res.status(500).json({
        success:false,
        message:'Login Failure',
     });
    }
}