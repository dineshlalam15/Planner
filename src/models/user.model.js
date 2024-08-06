import { Schema, model } from "mongoose";
import { compare, hash } from "bcrypt";

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
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    displayPicture: {
        type: String,
    },
    refreshToken: {
        type: String
    },
    createdTasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task",
        default: []
    }],
    assignedTasks: [{
        type: Schema.Types.ObjectId,
        ref: "Task",
        default: []
    }]    
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next()
    }
    this.password = await hash(this.password, 10)
    next()
})

userSchema.methods.checkPassword = async function(password){
    return await compare(password, this.password)
}

const User = model('User', userSchema)

export default User