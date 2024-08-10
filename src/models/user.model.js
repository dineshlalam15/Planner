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
        minLength: 8,
        validate: {
            validator: function(value) {
                return this.isOAuthUser || (value && value.length >= 8);
            },
            message: 'Password should be at least 8 characters long'
        }
    },
    displayPicture: {
        type: String,
    },
    refreshToken: {
        type: String
    },
    accessToken: {
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
    }],
    isOAuthUser: {
        type: Boolean,
        default: false
    }
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