const router=require("express").Router()
const Product=require("../models/product")
const CryptoJS=require("crypto-js")
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}=require("./verifyToken")

router.post("/",verifyTokenAndAdmin,async(req,res)=>{
const newProduct=new Product(req.body)
try{
const savedProduct=await newProduct.save()
res.status(200).json(savedProduct)
}catch(err){
return res.status(500).json(err)
}
})





/////Update//////
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try{
const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
    $set:req.body},{new:true})
res.status(200).json(updatedProduct)
   }catch(err){
res.status(500).json(err) 
console.log(err);
   }
} )


// ///delete///
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
   try{
       await Product.findByIdAndDelete(req.params.id)
       return res.status(200).json("Successfully deleted product!!")
   }catch(err){
return res.status(401).send(err)
   }
})


// ///get product///
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
   try{
       const product=await Product.findById(req.params.id)
       return res.status(200).json(product); 
   }catch(err){
return res.status(401).send(err)
   }
})

// ///get all products///
router.get("/findall",verifyTokenAndAdmin,async(req,res)=>{
   const qNew=req.query.new
   const qCategory=req.query.category
   try{
    let products

    if(qNew){
        products=await Product.find().sort({createdAt:-1}).limit(3)
    }else if(qCategory){
products=await Product.find({categories:{
    $in:[qCategory]
}})}
else{
    products=await Product.find()
}
    
     
        res.status(200).json(products); 
   }catch(err){
return res.status(401).send(err)
   }
})

// ///get product stats///
router.get("/productstats",verifyTokenAndAdmin,async(req,res)=>{
   const date=new Date()
   const lastYear=new Date(date.setFullYear(date.getFullYear()-1))
   try{
      const data=await Product.aggregate([
       {$match:{createdAt:{
         $gte:lastYear
      }}},
       {
         $project:{
            month:{$month:"$createdAt"}
         }
       },
       {
         $group:{
            _id:"$month",
            total:{$sum:1},
         }
       }
      ])
      return res.status(200).json(data)
   }
   catch(err){
      return res.status(500).json(err)
   }
})

 
module.exports=router