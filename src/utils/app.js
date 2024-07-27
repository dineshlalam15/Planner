import express from 'express'
import router from '../routers/user.router.js';

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: '16kb'}));

app.use('/api/v1/users', router)

export default app