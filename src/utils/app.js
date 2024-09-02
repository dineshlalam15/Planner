import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from '../routers/user.router.js';
import taskRouter from '../routers/task.router.js';
import passport from 'passport';
import session from 'express-session';
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

app.get('/', (req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>");
});

app.get('/auth', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/auth/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
    })
);

app.get('/auth/callback/success', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/callback/failure');
    }
    res.send(req.user.email);
});

app.get('/auth/callback/failure', (req, res) => {
    res.send("Error");
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

export default app;