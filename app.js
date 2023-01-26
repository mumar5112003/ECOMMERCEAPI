
require('dotenv').config()
const express = require("express")
const mongoose =require("mongoose")
const userRoute=require("./route/User")
const authRoute=require("./route/Auth")
const orderRoute=require("./route/Order")
const productRoute=require("./route/Product")
const cartRoute=require("./route/Cart")
const app=express();

mongoose.connect(process.env.DB_SECRET_KEY).then( ()=> {
    console.log("DB connection Successful!!");}).catch((err)=>{console.log(err);})
app.use(express.json())
app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderRoute)
app.use("/api/cart",cartRoute)

  app.listen(process.env.PORT,function (req,res) {
  console.log("Server is running on port 3000");     
  })