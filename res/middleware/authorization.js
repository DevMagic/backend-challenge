const jwt = require("jsonwebtoken")
require('dotenv').config({path:'./.env'})


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_KEY)
        req.user = decodedToken
        next()
    }catch(err){
        res.status(403).send({"error": "Unauthorized token"})
        
    } 
}
