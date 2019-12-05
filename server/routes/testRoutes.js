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
    var answer=JSON.parse(req.fields.answer)
    var obj=await test.checkAnswer(answer) //Возвращается верно ли ответил пользователь
    var quest,testRes=''
    if(!obj.endtest)
        quest=await test.getQuestion(answer.login)
    else{
        testRes=test.getRightAnswers(answer.login)
    }
    res.send(JSON.stringify({question:quest,isRight:obj.right,endtest:obj.endtest,rightAnswers:testRes}))
})
module.exports=router