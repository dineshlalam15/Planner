import express from 'express'
import cookieParser from 'cookie-parser';
import userRouter from '../routers/user.router.js'
import taskRouter from '../routers/task.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)

export default app