import passport from "passport";
import { Strategy as GoogleStartegy } from "passport-google-oauth2";
import User from "../models/user.model.js";

passport.use(
  new GoogleStartegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const exist = await User.findOne({ email: profile["emails"][0].value });
      if (!exist) {
        await User.create({
          name: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          },
          email: profile.emails[0].value,
          displayPicture: profile.photos[0].value,
          refreshToken: refreshToken,
          accessToken: accessToken,
          isOAuthUser: true,
        });
      }
      const user = await User.findOne({ email: profile.emails[0].value });
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});
  
passport.deserializeUser(function (user, done) {
    done(null, user);
});