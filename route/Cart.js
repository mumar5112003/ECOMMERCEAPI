const router=require("express").Router()
const Cart=require("../models/cart")
const CryptoJS=require("crypto-js")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken")


/////////create/////
router.post("/",verifyToken,async(req,res)=>{
const newCart=new Cart(req.body)
try{
const savedCart=await newCart.save()
res.status(200).json(savedCart)
}catch(err){
return res.status(500).json(err)
}
})





/////Update//////
router.put("/:id",verifyToken,async(req,res)=>{
   try{
const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{
    $set:req.body},{new:true})
res.status(200).json(updatedCart)
   }catch(err){
res.status(500).json(err) 
console.log(err);
   }
} )


// ///delete///
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
   try{
       await Cart.findByIdAndDelete(req.params.id)
       return res.status(200).json("Successfully deleted Cart!!")
   }catch(err){
return res.status(401).send(err)
   }
})


// ///get user Cart///
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
   try{
       const Cart=await Cart.findOne({userId:req.params.userId})
       return res.status(200).json(Cart); 
   }catch(err){
return res.status(401).send(err)
   }
})

// // ///get all Carts///
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
try{
const carts=await Cart.find()
return res.status(200).json(carts)
}catch(err){
return res.status(500).json(err)
}
})
 
module.exports=router