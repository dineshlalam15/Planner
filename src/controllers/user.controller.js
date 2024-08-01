import { isEmpty, validateUsername, validateEmail, validatePassword } from '../utils/validation.js'
import User from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

async function generateToken (user) {
    const payload = {
        _id: user._id
    }
    const secretKey = process.env.SECRET_TOKEN
    const options = {
        expiresIn: process.env.SECRET_TOKEN_EXPIRY
    }
    const jwtToken = jwt.sign(payload, secretKey, options)
    return jwtToken
}

const registerUser = async (req, res) => {
    const {userName, firstName, lastName, email, phoneNo, password} = req.body
    
    const requiredFields = {userName, firstName, email, password};
    for(const [key, value] of Object.entries(requiredFields)){
        if (isEmpty(value)) {
            return res.status(400).json({ error: `${key} can't be empty` });
        }
    }
    if(!validateUsername(userName)){
        return res.status(400).json({ error: 'userName not available' });
    }
    if(!validateEmail(email)){
        return res.status(400).json({ error: 'Enter a valid email' });
    }
    if(!validatePassword(password)){
        return res.status(400).json({ error: "Password doesn't meet security requirements" });
    }

    const existedUserName = await User.findOne({userName: userName})
    const existedEmail = await User.findOne({email: email})
    if(existedUserName){
        return res.status(400).json({error: 'userName not availaible'})
    }
    if(existedEmail){
        return res.status(400).json({error: 'User with this email already exist'})
    }

    if(phoneNo) {
        const existedPhoneNo = await User.findOne({phoneNo});
        if (existedPhoneNo) {
            return res.status(400).json({error: 'User with this phone number already exists'});
        }
    }

    let displayPicture;
    if(req.files && Array.isArray(req.files.displayPicture) && req.files.displayPicture.length > 0){
        const displayPictureLocalPath = req.files.displayPicture[0].path;
        displayPicture = await uploadOnCloudinary(displayPictureLocalPath);
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await User.create({
        userName,
        name: {
            firstName: firstName,
            lastName: lastName,
        },
        email: email,
        phoneNo: phoneNo,
        password: hashedPassword,
        displayPicture: displayPicture,
    });

    const createdUser = await User.findById(newUser._id).select("-password -token")
    return res.status(201).json({Message: 'New User Registered', Details: createdUser})
}

const loginUser = async (req, res) => {
    const {userName, email, password} = req.body
    if(userName != undefined && !userName){
        return res.status(400).json({error: 'Enter a valid userName'})
    }
    if(email != undefined && !email){
        return res.status(400).json({error: 'Enter a valid email'})
    }

    const findUser = await User.findOne({ $or: [{userName}, {email}] })
    if(!findUser){
        return res.status(404).json({error: 'User not found'})
    }

    const checkPassword = await compare(password, findUser.password)
    if(!checkPassword){
        return res.status(400).json({error: "Incorrect Password"})
    }

    const refreshToken = await generateToken(findUser)
    findUser.refreshToken = refreshToken
    await findUser.save()

    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken")
    return res.status(200)
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 4*3600000)
    }).json({
        user: loggedInUser,
        Message: 'User Logged-In Successfully',
        refreshToken: refreshToken
    })
}

const logoutUser = async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {new: true})
    res.clearCookie('refreshToken')
    return res.status(200).json({Message: "User Logged Out Successfully"})
}

const changePassword = async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    if(!oldPassword){
        return res.status(400).json({Message: "Please enter oldPassword"})
    }
    const findUser = await User.findById(req.user._id)
    const checkOldPassword = await compare(oldPassword, findUser.password)
    if(!checkOldPassword){
        return res.status(400).json({Message: "oldPassword you entered is incorrect"})
    }
    if(!newPassword){
        return res.status(400).json({Message: "Please enter the newPassword"})
    }
    if(isEmpty(newPassword)){
        return res.status(400).json({Message: "newPassword can't be empty"})
    }
    if(!validatePassword(newPassword)){
        return res.status(400).json({Message: "newPassword doesn't satisy the security requirements"})
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({Message: "newPassword and confirmPassword should be same"})
    }
    const hashedNewPassword = await hash(newPassword, 10)
    findUser.password = hashedNewPassword
    findUser.save()
    return res.status(200).json({Message: "Password changed successfully"})
}

export {registerUser, loginUser, logoutUser, changePassword}