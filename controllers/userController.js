const User = require("../models/user");
const bcrypt = require("bcrypt")
const {v4:uuid} = require("uuid")

exports.createUser = async (req, res) => {
  const {name, email, password} = req.body
  try{
        if(!name || !password || !email) {
            return res.status(400).send({"error":"Empety fieds"})
        }
        await User.findOne({email}).then((result)=>{
        if(result) {
            return res.status(400).send({"error":"E-mail already registered"})
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

exports.login = (req, res) => {

    try{

    }catch(err){
      console.log(err)
    }
  
};