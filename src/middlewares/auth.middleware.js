import dotenv from 'dotenv'
dotenv.config()
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next) => {
    try{
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({message: 'No token provided'});
        }
        const decodedInfo = jwt.verify(token, process.env.SECRET_TOKEN)
        const findUser = await User.findById(decodedInfo._id)
        req.user = findUser
        next()
    } catch(error){
        return res.status(400).json({error: error?.message || "Invalid Token"})
    }
}

export {verifyToken}