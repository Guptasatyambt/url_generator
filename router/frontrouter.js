const express=require("express");
const {handleregister,handleLogin}=require('../controller/front')
const router=express.Router();
// router.get("/home",fronturl)
router.post("/register",handleregister)
// router.get("/sign-up",signup)
router.post("/log-in",handleLogin)
// router.get("/login",login)


module.exports=router