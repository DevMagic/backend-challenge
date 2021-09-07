
const Mongoose = require("../database/mongodb")

const UserSchema = new Mongoose.Schema({
    id:{
        type: Number

    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

const User = Mongoose.model("User",UserSchema)
module.exports = User