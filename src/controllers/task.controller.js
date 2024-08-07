import { Task, stringToDate } from "../models/task.model.js";
import User from "../models/user.model.js";

const createTask = async(req, res) => {
    try {
        const findUser = await User.findById(req.user._id).select("-password -refreshToken")
        const {title, priority, started, deadline, status, assignedTo} = req.body   
        const findAssignedUser = await User.findOne({email: assignedTo}).select("-password -refreshToken")   
        if(!findAssignedUser){
            return res.status(404).json({message: "The user you are trying to assign the task doesn't exist"})
        }
        const newTask = await Task.create({
            title: title,
            priority: priority,
            status: status,
            createdBy: findUser,
            created: Date.now(),
            started: started ? stringToDate(started) : undefined,
            deadline: deadline ? stringToDate(deadline) : undefined,
            assignedTo: findAssignedUser,
        })
        findUser.createdTasks.push(newTask)
        findAssignedUser.assignedTasks.push(newTask)
        findUser.save()
        findAssignedUser.save()
        return res.status(200).json({
            status: "Task Created",
            createdBy: {
                name: findUser.name.firstName,
                _id: findUser._id
            },
            assignedTo: {
                name: findAssignedUser.name.firstName,
                _id: findAssignedUser._id
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const getTask = async(req, res) => {
    try {
        const {id} = req.params
        const findTask = await Task.findById(id).populate({
            path: "assignedTo",
            select: "name.firstName email"
        })
        return res.status(200).json({
            message: "Task Details Fetched Successfully",
            Task: findTask
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const updateTask = async(req, res) => {
    
}

export { 
    createTask ,
    getTask
}