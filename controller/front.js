const {v4:uuidv4}=require('uuid');

const {setuser}=require('../service/auth')
const URL=require('../models/user')
const User=require('../models/usermodel')
const shortid = require('shortid');

async function fronturl(req,res){
   
    const allurl=await URL.find({createdBy:User._id})
    return res.render("home",{
        urls:allurl,
    })
}

async function handleLogin(req,res){
    const {email,password}=req.body;
    if(!email || !password){
       res.json("All fields are required")
    }
    const availableUser=await User.findOne({email,password})
    if(!availableUser){ 
        return res.render("login",{
            error:"Invalid user name or password"
        })
    }

    
    const token=setuser(availableUser);
    res.cookie("token",token);
    const allurl=await URL.find({createdBy:User._id})
    return res.render("home",{  urls:allurl})

}



async function handleregister(req,res){
const {name,email,password}=req.body
if(!name || !email||!password){
    console.log("error")
}
const allReadyExist=await User.findOne({email})
if(allReadyExist){
    console.log("User already exist")
    return res.render("sign-up",{
        error:"exist"
    })
}

await User.create({
    name:name,
    email:email,
    password:password,
})

return res.render("login")


}
module.exports={fronturl,handleregister,handleLogin}