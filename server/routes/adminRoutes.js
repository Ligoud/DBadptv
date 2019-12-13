var express=require('express')
var router=express.Router()

const {myPg}=require('../postgre')
var pg=new myPg()  

const {Parser}=require('../parser')
var parser=new Parser()

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
router.get('/getQuest/:id',async (req,res)=>{
    let quest=await pg.getQuestion(req.params.id)
    res.send(JSON.stringify(quest))
})
router.post('/changeQuest',async (req,res)=>{
    let type=req.fields.cases===''?'openQuest':'casesQuest'
    pg.addOrChangeQuestion(req.fields.id,req.fields.question,type,req.fields.answer,req.fields.cases)
})
router.delete('/:id/:delted',async (req,res)=>{
    pg.deleteQuestion(req.params.id,req.params.delted)
})
router.get('/themes/:type/:nameTheme/:delted',async (req,res)=>{   //Получаю список вопросо по нужной теме
    let quests=await pg.getThemeQuestions(req.params.nameTheme,req.params.type,req.params.delted)
    res.send(JSON.stringify(quests.map((el)=>{
        return {questid:el.questid,question:el.question,delted:req.params.delted}
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