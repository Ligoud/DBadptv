const {myPg}=require('./server/postgre')
var pg=new myPg()   //Соединяю с бд
const {Parser}=require('./server/parser')
var parser=new Parser()

//Создаем сервер и настраиваем его
const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const formidale=require('express-formidable')
var app=express()
//
app.use(formidale())    //чтобы парсить xhr
//
app.use('/public',express.static(path.join(__dirname,'public')))
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
//
app.get('/',(req,res)=>{    
    res.render('index')
})
//Авторизация
var auth=require('./server/routes/authRoutes')
app.use('/auth',auth)
//Редактирование
var admin=require('./server/routes/adminRoutes')
app.use('/admin',admin)
//Тестирование
var test=require('./server/routes/testRoutes')
app.use('/test',test)
//
app.listen(8080,()=>{
    console.log('Сервер работает')
})
