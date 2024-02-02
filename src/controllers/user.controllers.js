import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'
import { request } from 'express';

export const registerUser = asyncHandler( async(req, res)=>{
    // take user data from frontend
    // validate - not empty
    // check if user already exists - username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // if not, create a new user
    // return message

    const {username, password, fullName, email} = req.body;

    if (
        [fullName, password, email, username].some((field) => field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser){
        throw new ApiError(409, "User with email or username already exists")
    }
    
    let avatarLocalPath;
    if(req.files && req.files.avatar){
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath;
    if(req.files && req.files.coverImage){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        username: username.toLowerCase(), 
        fullName, 
        password, 
        email, 
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new Error(500, "Something went wrong while creating a new user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered successfully")
    )

    
})