const {myPg}=require('./server/postgre')
var pg=new myPg()   //Соединяю с бд
const {Parser}=require('./server/parser')
var parser=new Parser()

//Создаем сервер
const path=require('path')
const express=require('express')
var app=express()
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
app.get('/admin/themes',(req,res)=>{
    res.send(JSON.stringify({
        arr:['a','b','c']
    }))
})
app.get('/admin/checkfiles',async (req,res)=>{
    var result=await parser.checkFiles()
    for(let i=0;i<result.length;i++){
        let cases='-'
        if(result[i].cases!==undefined) //Если есть варианты овтета (сделать в парсере)
            values=result[i].cases        
        
        //pg.addQuestion(result[i].quest,cases,result[i].answ)
    }
    console.log(result)
    res.send('true')
})
app.listen(8080,()=>{
    console.log('Сервер работает')
})
