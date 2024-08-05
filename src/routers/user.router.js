import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { verifyToken } from '../middlewares/auth.middleware.js'
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    changePassword, 
    updateUserDetails, 
    deleteAccount, 
    deleteDisplayPicture 
} from '../controllers/user.controller.js'

const router = Router()
router.route('/register').post(upload.fields([
    {
        name: "displayPicture",
        maxCount: 1
    }
]), registerUser)

router.route('/login').post(loginUser)
router.route('/logout').get(verifyToken, logoutUser)
router.route('/changepassword').patch(verifyToken, changePassword)
router.route('/updatedetails').patch(verifyToken, upload.fields([
    {
        name: "displayPicture",
        maxCount: 1
    }
]), updateUserDetails)
router.route('/deleteuser').delete(verifyToken, deleteAccount)
router.route('/deletedp').delete(verifyToken, deleteDisplayPicture)

export default router