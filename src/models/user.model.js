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
        type: Number
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    displayPicture: {
        type: String,
    },
    tasks: {
        type: Schema.Types.ObjectId,
        ref: "Task"
    }
}, {timestamps: true})

userSchema.index({ 
    phoneNo: 1 
}, { 
    unique: true, 
    partialFilterExpression: { 
        phoneNo: { 
            $exists: true, 
            $ne: null 
        } 
    } 
});

const User = model('User', userSchema)

export default User