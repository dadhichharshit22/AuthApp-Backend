const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {login,signup} = require("../Controllers/Auth");
const {auth,isStudent,isAdmin} = require("../middlewares/auth");
const User = require("../models/User");

router.post("/login",login);
router.post("/signup",signup);

// testing protected route for single middleware
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected Route for TESTS',
       });
});
//Protected Route
router.get("/student",auth,isStudent,(req,res)=>{
   res.json({
    success:true,
    message:'Welcome to the Protected Route for Students',
   });
});

router.get("/admin",auth,isAdmin,(req,res)=>{
res.json({
    success:true,
    message:'Welcome to the Protected Route for Admin',
});
});

router.get("/getEmail",auth,async(req,res)=>{
     try{
        const id = req.user.id;
        const user = await User.findById({id}); 

        res.status(200).json({
            success:true,
            user:user,
            message:'Welcome to the email route',
        })
     }
     catch(error){
        res.status(200).json({
            success:false,
            error:error.message,
            message:'Fatt gya code',
        })
     }

   
    console.log("ID: ",id);
    res.json({
        success:true,
        id:id,
        message:'Welcome to the Email Route',
    });
});



module.exports = router;