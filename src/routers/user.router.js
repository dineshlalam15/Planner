import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { 
    registerUser, 
    loginUser, 
    getUser,
    logoutUser, 
    changePassword, 
    updateUserDetails, 
    deleteAccount, 
    deleteDisplayPicture 
} from '../controllers/user.controller.js'

const userRouter = Router()

userRouter.route('/register').post(upload.fields([
    {
        name: "displayPicture",
        maxCount: 1
    }
]), registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/user').get(verifyToken, getUser)
userRouter.route('/logout').get(verifyToken, logoutUser)
userRouter.route('/changepassword').patch(verifyToken, changePassword)
userRouter.route('/updatedetails').patch(verifyToken, upload.fields([
    {
        name: "displayPicture",
        maxCount: 1
    }
]), updateUserDetails)
userRouter.route('/deleteuser').delete(verifyToken, deleteAccount)
userRouter.route('/deletedp').delete(verifyToken, deleteDisplayPicture)

export default userRouter