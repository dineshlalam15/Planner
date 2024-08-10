import { Schema, model } from "mongoose";

const subTaskSchema = new Schema({
    title: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'finished'],
        default: 'pending'
    }
})

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
        lowercase: true
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: 'pending',
        lowercase: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    subTasks: [{
        type: subTaskSchema,
        default: []
    }]    
}, {timestamps: true})

function stringToDate(dateString){
    const dateParts = dateString.split('-')
    const formattedDate = [dateParts[2], dateParts[1], dateParts[0]].join('-')
    return new Date(formattedDate)
}

const Task = model('Task', taskSchema)

export {Task, stringToDate}