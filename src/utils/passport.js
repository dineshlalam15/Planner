import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/callback",
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        try {
            let findUser = await User.findOne({ email: profile.emails[0].value });
            console.log(findUser);
            
            if (!findUser) {
                findUser = await User.create({
                    name: {
                        firstName: profile.name.givenName || "",
                        lastName: profile.name.familyName || "",
                    },
                    email: profile.emails[0].value,
                    displayPicture: profile.photos[0].value,
                    refreshToken: refreshToken,
                    accessToken: accessToken, 
                    isOAuthUser: true,
                });
            } else {
                findUser.refreshToken = refreshToken;
                findUser.accessToken = accessToken;
                await findUser.save({ validateBeforeSave: false });
                console.log(findUser);
                
            }
            return done(null, findUser);
        } catch (error) {
            console.error('Error in GoogleStrategy:', error);
            return done(error, null);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});