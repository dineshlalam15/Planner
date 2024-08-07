import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { 
    createTask ,
    getTask
} from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.route('/createtask').post(verifyToken, createTask)
taskRouter.route('/:id').get(getTask)

export default taskRouter