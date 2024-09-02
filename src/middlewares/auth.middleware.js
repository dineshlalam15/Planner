import dotenv from 'dotenv'
dotenv.config()
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken        
        if(!accessToken){
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(401).json({message: 'No token provided'});
            }
            const decodedInfo = jwt.verify(refreshToken, process.env.SECRET_TOKEN)
            const findUser = await User.findById(decodedInfo._id)
            if (!findUser || findUser.refreshToken !== token) {
                return res.status(403).json({ message: 'Invalid refreshToken' });
            }
            const payload = {
                _id: findUser._id
            }
            const secretKey = process.env.SECRET_TOKEN
            const accessTokenOptions = {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
            const generateAccessToken = jwt.sign(payload, secretKey, accessTokenOptions);
            findUser.accessToken = generateAccessToken
            await findUser.save({validateBeforeSave: false})
            res.setHeader('Authorization', `Bearer ${generateAccessToken}`);
            req.user = findUser
            return next()
        } 
        const decodedInfo = jwt.verify(accessToken, process.env.SECRET_TOKEN);
        const findUser = await User.findById(decodedInfo._id)
        if (!findUser || findUser.accessToken !== accessToken) {
            return res.status(403).json({ message: 'Invalid accessToken' });
        }
        req.user = findUser;
        next();
    } catch(error){
        return res.status(400).json({error: error?.message || "Invalid Token"})
    }
}

export {verifyToken}