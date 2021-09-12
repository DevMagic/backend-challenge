const mongoose = require("mongoose")
require('dotenv').config({path:'./.env'})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}
@cluster0.oiiva.mongodb.net/db_crud_lol?retryWrites=true&w=majority`
try{
    mongoose.connect( uri, {useNewUrlParser: true, useUnifiedTopology: true})

    mongoose.connection.on("connected", ()=>{
        console.log("connected to Mongodb...")
    })
    mongoose.connection.on("error", (err)=>{
        console.log("error to connect to mongodb: "+err)
    })

}catch(err){
    console.log("Error connecting to database")
}


module.exports = mongoose;