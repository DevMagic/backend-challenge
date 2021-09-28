const User = require("../models/user");
const bcrypt = require("bcrypt")
const {v4:uuid} = require("uuid")
const jwt = require("jsonwebtoken")
require('dotenv').config({path:'./.env'})
const handlingErrors = require("../handling/handling")

exports.createUser = async (req, res) => {
  const {name, email, password} = req.body
  try{
    const erros = await handlingErrors.handling(req.body,[35,20,20],[4,10,6])
    if(erros.length){
        return res.status(400).send({error: erros.join("; ")})
    }
        const user = await User.findOne({email})
        if(user) {
            return res.status(409).send({"error":"E-mail already registered"})
        }
        else{
            const hashPassWord = bcrypt.hashSync(password,10)
            const user = await User.create({
                _id: uuid(),
                name: name,
                email: email,
                password: hashPassWord
            })
            return res.status(201).send(user)  
        }
       
  }catch(err){
    return res.status(400).send({"error":"error when registering the user"})

  }

};

exports.login = async (req, res) => {
    const {name, email, password} = req.body
    const erros = await handlingErrors.handling(req.body,[35,20,20],[4,10,6])
    if(erros.length){
        return res.status(400).send({error: erros.join("; ")})
    }
    try{
        if(!name || !email || !password){
            return res.status(400).send({"error":"Empty fieds"})
        }
        const user = await User.findOne({email: email})

        if(user){

            bcrypt.compare(password, user.password, async(err, resultPassword)=>{
                if(resultPassword && (user.name === name)){
                    const token = jwt.sign({
                        _id: user._id,
                        email: email
                    },process.env.JWT_KEY,{
                        expiresIn: "10h"
                    })
                    return res.status(200).send({"token":token})
                }
                return res.status(401).send({"error":"Authentication failed"})
            })
            
        }else{
            return res.status(401).send({"error":"Authentication failed"})
        }

    }catch(err){
        return res.status(400).send({"error":err})
    }
  
};