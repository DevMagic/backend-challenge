const Mongoose = require("../database/mongodb")

const UserSchema = new Mongoose.Schema({
    _id:{
        type: String
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
},
{ versionKey: false })


const User = Mongoose.model("User",UserSchema)
module.exports = User