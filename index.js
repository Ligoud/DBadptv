const {myPg}=require('./server/postgre')
var pg=new myPg()   //Соединяю с бд

//Создаем сервер
const path=require('path')
const express=require('express')
var app=express()
app.use('/public',express.static(path.join(__dirname,'public')))
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');



app.get('/',(req,res)=>{    
    res.render('index')
})
app.get('/test',(req,res)=>{
    console.log('kek')
    res.render('test')
})
app.listen(8080,()=>{
    console.log('Сервер работает')
})
