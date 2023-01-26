const router=require("express").Router()
const User=require("../models/user")
const CryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken")
//register//

router.post("/register", async(req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString(),
    })
    try{
    const savedUser=await newUser.save()
 return res.status(201).json(savedUser)
// console.log(savedUser);
}catch(err){
        res.status(500).json(err)
        // console.log(err);
    } 
})

//login////
 
router.post("/login",async(req,res)=>{
    try{
    const user= await User.findOne({username:req.body.username});
    if(!user)
          return res.status(401).json("wrong username")
        const hash=CryptoJS.AES.decrypt(user.password,process.env.PASS_SECRET);
    const orgPassword=hash.toString(CryptoJS.enc.Utf8); 
    
       if(orgPassword!==req.body.password){
        return res.status(401).json("wrong password")
            }

            const accessToken=jwt.sign({
                 id:user._id,
                 isAdmin:user.isAdmin
            },process.env.JWT_SECRET,{expiresIn:"3d"})
                const{password,...others}=user._doc; 
                res.status(200).json({...others, accessToken}); 
            
        }

   
   
    catch(err){
        res.status(500).json(err)
    } 
})

module.exports=router