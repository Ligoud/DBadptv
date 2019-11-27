var express=require('express')
var router=express.Router()

const {myPg}=require('../postgre')
var pg=new myPg()  

//Редактирование вопросов
router.get('/',(req,res)=>{
    res.render('admin')
})
router.get('/themes/:type',async (req,res)=>{
    let allthemes=await pg.getQuestionThemes(req.params.type)
    res.send(JSON.stringify({
        arr:allthemes.map((el)=>{
            return el.theme
        })
    }))
    
})
router.delete('/:id',async (req,res)=>{
    pg.deleteQuestion(req.params.id)
})
router.get('/themes/:type/:nameTheme',async (req,res)=>{   //Получаю список вопросо по нужной теме
    let quests=await pg.getThemeQuestions(req.params.nameTheme,req.params.type)
    res.send(JSON.stringify(quests.map((el)=>{
        return {questid:el.questid,question:el.question}
    })))
})
router.get('/checkfiles',async (req,res)=>{
    var result=await parser.checkFiles()
    for(let i=0;i<result.length;i++){
        pg.addQuestion(result[i].type,result[i].theme,result[i].level ,result[i].quest,result[i].cases,result[i].answ)        
    }
    res.send('true')
})

module.exports=router