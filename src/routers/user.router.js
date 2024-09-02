import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { 
    registerUser, 
    loginUser, 
    getUser,
    logoutUser, 
    refreshAccessToken,
    changePassword, 
    updateUserDetails, 
    deleteAccount, 
    deleteDisplayPicture 
} from '../controllers/user.controller.js'

const userRouter = Router()

const uploadImageOptions = {
    name: "displayPicture",
    maxCount: 1
}

userRouter.route('/register').post(upload.fields([uploadImageOptions]), registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/user').get(verifyToken, getUser)
userRouter.route('/logout').delete(verifyToken, logoutUser)
userRouter.route('/refresh-accesstoken').get(refreshAccessToken)
userRouter.route('/changepassword').patch(verifyToken, changePassword)
userRouter.route('/updatedetails').patch(verifyToken, upload.fields([uploadImageOptions]), updateUserDetails)
userRouter.route('/deleteuser').delete(verifyToken, deleteAccount)
userRouter.route('/deletedp').delete(verifyToken, deleteDisplayPicture)

export default userRouter