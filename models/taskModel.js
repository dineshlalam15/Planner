import { Schema, model } from "mongoose";

const subTaskSchema = new Schema({
    deadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Finished'],
        default: 'Pending'
    }
})

const SubTask = model('SubTask', subTaskSchema)

const taskSchema = new Schema({
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    started: {
        type: Date
    },
    deadline: {
        type: Date
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    subTasks: [{
        type: Schema.Types.ObjectId,
        ref: "SubTask"
    }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    }
}, {timestamps: true})

const Task = model('Task', taskSchema)

export default Task