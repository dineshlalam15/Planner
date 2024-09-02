import { isEmpty, validateEmail, validatePassword } from '../utils/validation.js'
import User from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generateTokens = async (user) => {
    const payload = {
        _id: user._id
    }
    const secretKey = process.env.SECRET_TOKEN
    const refreshTokenOptions = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    const accessTokenOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    const refreshToken = jwt.sign(payload, secretKey, refreshTokenOptions)
    const accessToken = jwt.sign(payload, secretKey, accessTokenOptions)
    return {refreshToken, accessToken}
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({message: "refreshToken Invalid"})
    }
    jwt.verify(refreshToken, process.env.SECRET_TOKEN, async (err, user) => {
        if(err){
            return res.sendStatus(403).json({message: "Authorization refused by the server"});
        }
        const payload = {
            _id: user._id
        }
        const secretKey = process.env.SECRET_TOKEN
        const accessTokenOptions = {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        const accessToken = jwt.sign({ payload, secretKey, accessTokenOptions })
        await User.findByIdAndupdate(user._id, 
            { 
                accessToken: accessToken 
            }, 
            {new: true}
        );
        res.status(201).json({ 
            message: "accessToken generated",
            accessToken: accessToken 
        });
    });
}

const registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body
        const requiredFields = {firstName, email, password};
        for(const [key, value] of Object.entries(requiredFields)){
            if (isEmpty(value)) {
                return res.status(400).json({ error: `${key} can't be empty` });
            }
        }
        if(!validateEmail(email)){
            return res.status(400).json({ error: 'Enter a valid email' });
        }
        if(!validatePassword(password)){
            return res.status(400).json({ error: "Password doesn't meet security requirements" });
        }
        const existedUser = await User.findOne({email: email})
        if(existedUser){
            return res.status(400).json({error: 'User with this email already exist'})
        }
        let displayPicture;
        if(req.files && Array.isArray(req.files.displayPicture) && req.files.displayPicture.length > 0){
            const displayPictureLocalPath = req.files.displayPicture[0].path;
            if(displayPictureLocalPath){
                displayPicture = await uploadOnCloudinary(displayPictureLocalPath);
            }   
        }
        const newUser = await User.create({
            name: {
                firstName: firstName,
                lastName: lastName || undefined,
            },
            email: email,
            password: password,
            displayPicture: displayPicture || undefined
        });
        const createdUser = await User.findById(newUser._id).select("-password -token")
        return res.status(201).json({
            Message: 'New User Registered', 
            Details: createdUser
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({message: error.message})
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    if(email != undefined && !email){
        return res.status(400).json({error: 'Enter a valid email'})
    }
    const findUser = await User.findOne({email: email})
    if(!findUser){
        return res.status(404).json({error: 'User not found'})
    }
    const checkPassword = await findUser.checkPassword(password)
    if(!checkPassword){
        return res.status(400).json({error: "Incorrect Password"})
    }
    const {refreshToken, accessToken} = await generateTokens(findUser)
    findUser.refreshToken = refreshToken
    findUser.accessToken = accessToken
    await findUser.save({validateBeforeSave: false})
    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken -accessToken")
    return res.status(200)
    .cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000)
    })
    .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000)
    })
    .json({
        user: loggedInUser,
        Message: 'User Logged-In Successfully',
        refreshToken: refreshToken,
        accessToken: accessToken
    })
}

const getUser = async(req, res) => {
    const findUser = await User.findById(req.user._id).select("-password -refreshToken -accessToken")
    return res.status(200).json({
        message: "user details",
        user: findUser
    })
}

const logoutUser = async(req, res) => {
    try{
        await User.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: "",
                accessToken: ""
            }
        }, {new: true})  
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.status(200).json({Message: "User Logged Out Successfully"})
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const findUser = await User.findById(req.user._id)
        if (isEmpty(oldPassword)){
            return res.status(400).json({ message: "Please enter oldPassword" });
        }
        const checkOldPassword = await findUser.checkPassword(oldPassword);
        if (!checkOldPassword) {
            return res.status(400).json({ message: "oldPassword you entered is incorrect" });
        }
        if (isEmpty(newPassword)) {
            return res.status(400).json({ message: "newPassword can't be empty" });
        }
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ message: "newPassword doesn't satisfy the security requirements" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "newPassword and confirmPassword should be the same" });
        }
        await findUser.save()
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while changing the password" });
    }
};

const updateUserDetails = async(req, res) => {
    const {firstName, lastName} = req.body
    const findUser = await User.findById(req.user._id)
    try {
        let displayPicture
        if (req.files && Array.isArray(req.files.displayPicture) && req.files.displayPicture.length > 0) {
            const displayPictureLocalPath = req.files.displayPicture[0].path
            if(displayPictureLocalPath){
                displayPicture = await uploadOnCloudinary(displayPictureLocalPath)
            }
        }
        const updatedUserDetails = await User.findByIdAndUpdate(req.user._id, {
            name: {
                firstName: firstName ? firstName : findUser.name.firstName,
                lastName: lastName ? lastName : findUser.name.lastName,
            },
            displayPicture: displayPicture ? displayPicture : findUser.displayPicture
        }, {new: true}).select("-password -refreshToken")
        return res.status(200).json({
            message: "User details updated successfully",
            updatedUserDetails: updatedUserDetails
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

const deleteDisplayPicture = async(req, res) => {
    const findUser = await User.findById(req.user._id)
    const cloudinaryURL = findUser.displayPicture
    if(!cloudinaryURL){
        return res.status(400).json({message: "There is no image uploaded on Cloudinary"})
    }
    findUser.displayPicture = undefined
    findUser.save({validateBeforeSave: false})
    return res.status(200).json({message: "displayPicture deleted"})
}

const deleteAccount = async(req, res) => {
    const deletedUserName = req.user.userName
    await User.findByIdAndDelete(req.user._id)
    return res.status(200).json({
        message: "Account succesfully deleted",
        deletedUser: deletedUserName
    })
}

export {
    registerUser, 
    loginUser, 
    getUser,
    logoutUser, 
    refreshAccessToken,
    changePassword, 
    updateUserDetails, 
    deleteAccount, 
    deleteDisplayPicture
}