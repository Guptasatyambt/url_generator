const express=require("express");
const {handleGeneratedurl,redirecttourl,analytics,deleteurl}=require('../controller/user')
const router=express.Router();

router.post('/',handleGeneratedurl)
router.get('/:shortid',redirecttourl)
router.get('/:shortid/delete',deleteurl)
router.get('/analytics/:shortid',analytics)
module.exports=router