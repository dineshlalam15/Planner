import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const taskRouter = Router()

taskRouter.route('/createtask').post(verifyToken, createTask)

export default taskRouter