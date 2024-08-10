import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { 
    createTask ,
    getTask,
    updateTask,
    deleteTask,
    createSubTask
} from "../controllers/task.controller.js";

const taskRouter = Router()

taskRouter.route('/createtask').post(verifyToken, createTask)
taskRouter.route('/:id').get(getTask)
taskRouter.route('/:id').patch(updateTask)
taskRouter.route('/:id').delete(deleteTask)
taskRouter.route('/:id/createsubtask').post(createSubTask)

export default taskRouter