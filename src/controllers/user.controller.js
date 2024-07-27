import { isEmpty, validateUsername, validateEmail, validatePassword } from '../utils/validation.js'
import User from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { hash } from 'bcrypt'

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
            lastName: lastName || "",
        },
        email: email,
        phoneNo: phoneNo || "",
        password: hashedPassword,
        displayPicture: displayPicture || "",
    });

    const createdUser = await User.findById(newUser._id).select("-password")
    return res.status(201).json({Message: 'New User Registered', Details: createdUser})
}

export {registerUser}