var express=require('express')
var router=express.Router()


const {Test} =require('../test')
var test=new Test()

router.get('/',(req,res)=>{
    res.render('test')
})
router.get('/startTest/:login',async (req,res)=>{
    var quest=await test.getStarded(req.params.login)
    res.send(JSON.stringify(quest))
    //var ids=await pg.getIds()
    //res.send(JSON.stringify({arrID:ids}))
})
router.post('/answer',async(req,res)=>{
    
})
module.exports=router