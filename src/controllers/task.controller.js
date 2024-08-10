import { Task, stringToDate } from "../models/task.model.js";
import User from "../models/user.model.js";
import { isEmpty } from '../utils/validation.js'

const createTask = async(req, res) => {
    try {
        const findUser = await User.findById(req.user._id).select("-password -refreshToken")
        const {title, priority, started, deadline, status, assignedTo} = req.body  
        const validAssignedUsers = []
        for(const email of assignedTo){
            const findAssignedUser = await User.findOne({email: email}).select("-password -refreshToken")
            if(!findAssignedUser){
                return res.status(404).json({message: "The user you are trying to assign the task doesn't exist"})
            } else{
                validAssignedUsers.push(findAssignedUser)
            }
        }
        const newTask = await Task.create({
            title: isEmpty(title) ? Untitled : title,
            priority: priority ? priority : undefined,
            status: status ? status : undefined,
            createdBy: findUser,
            created: Date.now(),
            started: started ? stringToDate(started) : undefined,
            deadline: deadline ? stringToDate(deadline) : undefined,
            assignedTo: validAssignedUsers,
        })
        findUser.createdTasks.push(newTask)
        await findUser.save()
        const result = []
        validAssignedUsers.forEach(async user => {
            result.push({
                name: user.name.firstName,
                _id: user._id
            })
            user.assignedTasks.push(newTask)
            await user.save({validateBeforeSave: false})
        })
        return res.status(200).json({
            status: "Task Created",
            createdBy: {
                name: findUser.name.firstName,
                _id: findUser._id
            },
            assignedTo: result
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
        }).select("-createdAt -updatedAt -__v")
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
    const {id} = req.params
    const findTask = await Task.findById(id)
    const {title, priority, started, deadline, status, assignedTo} = req.body
    const validAssignedUsers = []
    if(assignedTo != ''){
        for(const email of assignedTo){
            const findAssignedUser = await User.findOne({email: email}).select("-password -refreshToken")
            if(!findAssignedUser){
                return res.status(404).json({message: "The user you are trying to assign the task doesn't exist"})
            } else{
                validAssignedUsers.push(findAssignedUser)
            }
        }
    }
    if(validAssignedUsers.length != 0){
        validAssignedUsers.forEach(user => {
            findTask.assignedTo.push(user)
        })
    }
    findTask.title = title ? title : findTask.title
    findTask.started = started ? stringToDate(started) : findTask.started
    findTask.deadline = deadline ? stringToDate(deadline) : findTask.deadline
    findTask.status = status ? status : findTask.status
    findTask.priority = priority ? priority : findTask.priority
    findTask.assignedTo = findTask.assignedTo
    await findTask.save({validateBeforeSave: false})
    return res.status(200).json({
        message: "Task Updated",
        Task: findTask
    })
}

const deleteTask = async(req, res) => {
    try{
        const {id} = req.params
        const findTask = await Task.findById(id)
        if(!findTask){
            return res.status(400).json({message: "The task you are trying to delete doesn't exist anymore"})
        }
        await Task.findByIdAndDelete(id)
        return res.status(200).json({message: "Task deleted Succesfully"})
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const createSubTask = async(req, res) => {
    const {id} = req.params
    const {title, status} = req.body
    const findTask = await Task.findById(id)
    const newSubTask = {
        title: title,
        status: status
    }
    findTask.subTasks.push(newSubTask)
    await findTask.save()
    return res.status(201).json({
        message: "subTask Created",
        subTask: newSubTask,
        parentTask: findTask
    })
}

export { 
    createTask ,
    getTask,
    updateTask,
    deleteTask,
    createSubTask,
}