const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");






const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Get userId from the authenticated user's token
    const { username, last_name, first_name, phoneNumber, user_type } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check for new username conflicts (do not update email)
    if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            res.status(400);
            throw new Error("Username already registered");
        }
        user.username = username;
    }

    // Update only allowed fields (first_name, last_name, phoneNumber)
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (user_type) user.user_type = user_type;

    // Save the updated user information
    const updatedUser = await user.save();

    // Send success response with message and updated user data
    res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: {
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,  // Email remains unchanged
            last_name: updatedUser.last_name,
            first_name: updatedUser.first_name,
            phoneNumber: updatedUser.phoneNumber,
            user_type: updatedUser.user_type,
        }
    });
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
        {expiresIn: "500m"}
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



// /register a user

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, last_name, first_name, password, phoneNumber } = req.body;
    
    // Check for missing fields and return specific error messages
    if (!username) {
        res.status(400);
        throw new Error("Username is required");
    }
    
    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    if (!password) {
        res.status(400);
        throw new Error("Password is required");
    }

    if (!first_name) {
        res.status(400);
        throw new Error("First name is required");
    }

    if (!last_name) {
        res.status(400);
        throw new Error("Last name is required");
    }

    if (!phoneNumber) {
        res.status(400);
        throw new Error("Phone number is required");
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(400);
        throw new Error("Username already registered");
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        res.status(400);
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
        username,
        email,
        last_name,
        first_name,
        phoneNumber,
        password: hashedPassword,
    });

    // Return success response if user was created
    if (user) {
        res.status(201).json({ 
            _id: user.id, 
            email: user.email, 
            last_name: user.last_name, 
            first_name: user.first_name, 
            phoneNumber: user.phoneNumber 
        });
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
});


//logged in  user
const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id); // Fetch user details by ID

    if (user) {
        res.status(200).json({
            status: "success",
            message: "User data retrieved",
            user: {
                _id: user._id,
                first_name:user.first_name,
                last_name:user.last_name,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                createdAt: user.createdAt, 
                updatedAt: user.updatedAt,
            },
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});


module.exports = {registerUser, loginUser, currentUser, updateProfile}