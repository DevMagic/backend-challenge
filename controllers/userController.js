const User = require("../models/user");
const bcrypt = require("bcrypt")
const {v4:uuid} = require("uuid")
const jwt = require("jsonwebtoken")
require('dotenv').config({path:'./.env'})
exports.createUser = async (req, res) => {
  const {name, email, password} = req.body
  try{
        if(!name || !password || !email) {
            return res.status(400).send({"error":"Empety fieds"})
        }
        await User.findOne({email}).then((result)=>{
        if(result) {
            console.log(result)
            return res.status(409).send({"error":"E-mail already registered"})
        }
        else{
            (async()=>{
                const hashPassWord = bcrypt.hashSync(password,10)
                const user = await User.create({
                    _id: uuid(),
                    name: name,
                    email: email,
                    password: hashPassWord
                })
                return res.status(201).send(user) 

            })();
        }
     })
             
  }catch(err){
    console.log(`Erro encontrado: ${err}`)
  }

};

exports.login = async (req, res) => {
    const {name, email, password} = req.body
    
    try{
        if(!name || !email || !password){
            return res.status(400).send({"error":"Empety fieds"})
        }
    await User.findOne({email: email}).then((result)=>{
        if(result){
            bcrypt.compare(password, result.password, async(err, resultPassword)=>{
                if(resultPassword && (result.name === name)){
                    const token = jwt.sign({
                        _id: result._id,
                        email: result.email
                    },process.env.JWT_KEY,{
                        expiresIn: "1H"
                    })
                    return res.status(400).send({"token":token})
                }
                return res.status(401).send({"error":"Authentication failed"})
            })
            
        }else{
            return res.status(401).send({"error":"Authentication failed"})
        }
    })
    }catch(err){
      console.log(err)
    }
  
};