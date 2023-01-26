const router=require("express").Router()
const Order=require("../models/order")
const CryptoJS=require("crypto-js")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken")


/////////create/////
router.post("/",verifyToken,async(req,res)=>{
const newOrder=new Order(req.body)
try{
const savedOrder=await newOrder.save()
res.status(200).json(savedOrder)
}catch(err){
return res.status(500).json(err)
}
})





/////Update//////
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try{
const updatedOrder=await Order.findByIdAndUpdate(req.params.id,{
    $set:req.body},{new:true})
res.status(200).json(updatedOrder)
   }catch(err){
res.status(500).json(err) 
console.log(err);
   }
} )


// ///delete///
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try{
       await Order.findByIdAndDelete(req.params.id)
       return res.status(200).json("Successfully deleted Order!!")
   }catch(err){
return res.status(401).send(err)
   }
})


// ///get user Order///
router.get("/find/:userId",verifyTokenAndAuthorization,async(req,res)=>{
   try{
       const Order=await Order.find({userId:req.params.userId})
       return res.status(200).json(Order); 
   }catch(err){
return res.status(401).send(err)
   }
})

// // ///get all Orders///
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
try{
const Orders=await Order.find()
return res.status(200).json(Orders)
}catch(err){
return res.status(500).json(err)
}
})

////get monthly income///
router.get("/income",verifyTokenAndAdmin,async(req,res)=>{
    const date=new Date()
    const lastMonth=new Date(date.setMonth(date.getMonth()-1))
    const previousMonth= new Date(new Date().setMonth(lastMonth.getMonth()-1))
try{
const income=await Order.aggregate([
    {$match:{createdAt:{$gte:previousMonth}}},
    {
        $project:{
        month:{$month:"$createdAt"},
        sales:"$amount"
    }
},
    {
        $group:{
            _id:"$month",
            total:{$sum:"$sales"},
        },
}
    
])
return res.status(200).json(income)
}catch(err){
return res.status(500).json(err)
}

})
 
module.exports=router