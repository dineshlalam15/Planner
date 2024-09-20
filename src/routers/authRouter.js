import { Router } from "express";
import passport from "passport";

const authRouter = Router()

authRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

authRouter.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/login'
    }), (req, res) => {
        res.redirect('/')
    }
)

authRouter.get('/logout', (req, res, next) => {
    req.logout(error => {
        if(error){
            return next(error)
        }
        res.redirect('/')
    })
})

export default authRouter