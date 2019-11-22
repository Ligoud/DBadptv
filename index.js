const {myPg}=require('./server/postgre')
var pg=new myPg()   //Соединяю с бд
const {Parser}=require('./server/parser')
var parser=new Parser()

//Создаем сервер
const path=require('path')
const express=require('express')
//const bodyParser=require('body-parser')
var app=express()
//app.use(bodyParser.urlencoded({extended: false})) //Если парсить надо будет json
//app.use(bodyParser.json())
app.use('/public',express.static(path.join(__dirname,'public')))
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
//


app.get('/',(req,res)=>{    
    res.render('index')
})
app.get('/test',(req,res)=>{
    res.render('test')
})
app.get('/admin',(req,res)=>{
    res.render('admin')
})
app.get('/admin/themes/:type',async (req,res)=>{
    let allthemes=await pg.getQuestionThemes(req.params.type)
    res.send(JSON.stringify({
        arr:allthemes.map((el)=>{
            return el.theme
        })
    }))
    
})
app.delete('/admin/:id',async (req,res)=>{
    pg.deleteQuestion(req.params.id)
})
app.get('/admin/themes/:type/:nameTheme',async (req,res)=>{   //Получаю список вопросо по нужной теме
    let quests=await pg.getThemeQuestions(req.params.nameTheme,req.params.type)
    res.send(JSON.stringify(quests.map((el)=>{
        return {questid:el.questid,question:el.question}
    })))
})
app.get('/admin/checkfiles',async (req,res)=>{
    var result=await parser.checkFiles()
    for(let i=0;i<result.length;i++){
        pg.addQuestion(result[i].type,result[i].theme,result[i].level ,result[i].quest,result[i].cases,result[i].answ)        
    }
    res.send('true')
})
app.listen(8080,()=>{
    console.log('Сервер работает')
})
