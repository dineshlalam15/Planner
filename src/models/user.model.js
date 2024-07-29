import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        firstName:{
            type: String,
            required: true
        },
        lastName: {
            type: String
        }
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 4,
        maxLength: 16
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true
    },
    phoneNo: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    displayPicture: {
        type: String,
    },
    token: {
        type: String
    },
    tasks: {
        type: Schema.Types.ObjectId,
        ref: "Task"
    }
}, {timestamps: true})

const User = model('User', userSchema)

export default User