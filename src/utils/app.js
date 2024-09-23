import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import userRouter from '../routers/user.router.js';
import taskRouter from '../routers/task.router.js';
import './passport.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    return res.send("<button><a href='/auth'>Login With Google</a></button>")
});

app.get('/auth' , passport.authenticate('google', { 
        scope: [ 'email', 'profile' ]
    })
);

app.get("/login",
    passport.authenticate( 'google', {
        successRedirect: '/login/success',
        failureRedirect: '/login/failure'
    }),
);

app.get('/login/success' , (req , res) => {
    if(!req.user){
        return res.redirect('/auth/callback/failure');
    }
    return res.send("Welcome " + req.user.email);
});

app.get('/login/failure' , (req , res) => {
    return res.send("Error");
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

export default app;