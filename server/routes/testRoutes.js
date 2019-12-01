var express=require('express')
var router=express.Router()


const {Test} =require('../test')
var test=new Test()

router.get('/',(req,res)=>{
    res.render('test')
})
router.get('/startTest/:login',async (req,res)=>{
    await test.getStarded(req.params.login)
    var quest=await test.getQuestion(req.params.login)
    res.send(JSON.stringify(quest))
    //var ids=await pg.getIds()
    //res.send(JSON.stringify({arrID:ids}))
})
router.post('/answer',async(req,res)=>{
    await test.checkAnswer(JSON.parse(req.fields.answer))
    var quest=await test.getQuestion(JSON.parse(req.fields.answer).login)
    res.send(JSON.stringify(quest))
})
module.exports=router