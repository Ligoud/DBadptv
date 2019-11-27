var express=require('express')
var router=express.Router()

const {myPg}=require('../postgre')
var pg=new myPg()  

router.get('/',(req,res)=>{
    res.render('test')
})
router.get('/startTest',async (req,res)=>{
    var ids=await pg.getIds()
    res.send(JSON.stringify({arrID:ids}))
})
router.get('/getQuestion/:id',async (req,res)=>{    
    var quest=await pg.getQuest(req.params.id)
    res.send(JSON.stringify({question:quest}))
})
module.exports=router