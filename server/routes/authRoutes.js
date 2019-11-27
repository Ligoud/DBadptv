var express=require('express')
var router=express.Router()

const {myPg}=require('../postgre')
var pg=new myPg()  

router.get('/',(req,res)=>{
    res.render('auth')
})
router.post('/login',async (req,res)=>{
    var obj={
        logedIn: false,
        login:'',
        role: ''
    }
    var result=await pg.checkLogin(req.fields.login,req.fields.password)    
    if(result.length>0){
        obj.logedIn=true
        obj.login=result[0].login
        obj.role=result[0].role
    }    
    res.send(JSON.stringify(obj))
})
router.post('/register',async (req,res)=>{    
    var result=await pg.addUser(req.fields.login,req.fields.password)    
    res.send(JSON.stringify({registered:result}))
})

module.exports =router