const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")



// /register a user

const registerUser = asyncHandler(async (req, res)=>{
    const {username, email, password } = req.body;
    if( !username || !email || !password ){
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const userAvailable = await User.findOne({email});
    if (userAvailable){
        res.status(400);
        throw new Error("user already registered")
    }

    //hash password  
    const hashedPassword =  await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = await User.create({
        username,
        email,
        password: hashedPassword   
     });
     if(user){
        res.status(201).json({_id:user.id, email:user.email});
     }else{
        res.status(400);
        throw new Error("user data not valid")
     }
    res.json({ message: "Register the user"})

});



//login user
const loginUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("All fields required")
    }

    const user = await User.findOne({email});

    //compare password with has

    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_sECRET,
        {expiresIn: "60m"}
    );
        res.status(200).json({
            
            status: "success",
            message: "user data retrieved",
            user:{
                _id:user.id, 
            email:user.email,
            },
            accessToken});
    } else{
        res.status(401)
        throw new Error("email or password is not valid")
    }
});


//logged in  user
const currentUser =  asyncHandler(async  (req, res)=>{
    res.json({ message: "current user"})

});


module.exports = {registerUser, loginUser, currentUser}