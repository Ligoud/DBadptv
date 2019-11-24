var {Pool}=require('pg')
var uri='postgres://postgres:4049@localhost:5432/dbtest'
var client=new Pool({
    connectionString: uri
})

client.connect((err)=>{
    if(err)
        console.error(err)
    else
        console.log('Соединение установлено')
})

class myPg{
    constructor(){
        /*client.query("create table if not exists users (name varchar(50) default 'user', UserID serial PRIMARY KEY, password text default '123');",(err,res)=>{
            if(err)
                console.error(err)
        })
        client.query("create table if not exists userInfo (UserID integer PRIMARY KEY references users(login),role text default 'student', mygroup varchar(10) default '-');",(err,res)=>{
            if(err)
                console.error(err)
        })*/
        client.query("create table if not exists questions (questID serial PRIMARY KEY,theme text default 'neutral',level integer NOT NULL,type text NOT NULL,question text NOT NULL UNIQUE, cases text default '-',answer text NOT NULL, delted bool default false);",(err,res)=>{
            if(err)
                console.error(err)
        })
        client.query("create table if not exists users (login text PRIMARY KEY,password text NOT NULL,name text default '-', user_group text default '-',role text default 'user')",(err,res)=>{
            if(err)
                console.error(err)
        })
        //тут же триггеры и пользовательские функции создать
    }
    async deleteQuestion(id){
        client.query({text:'UPDATE questions SET delted=true WHERE questID=$1',values:[id]})
    }
    async addUser(login,password){
        var registered=true
        try{
        await client.query({text:'INSERT INTO users (login,password) values ($1::text,$2::text)', 
                            values:[login,password]})
        }catch(err){
            registered=false
        }
        return registered
    }
    async checkLogin(login,password){
        var {rows}=await client.query({
            text:'SELECT role,login FROM users WHERE $1::text=login AND $2::text=password',
            values:[login,password]
        })
        return rows
    }
    async getQuestionThemes(type='all'){     //Получаю темы из таблицы
        var res
        if(type!=='all')
            res=await client.query({text:"SELECT DISTINCT theme FROM questions WHERE type=$1",values:[type]})        
        else{
            res=await client.query({text:"SELECT DISTINCT theme FROM questions"})        
        }
        var {rows}=res
        return rows
    }
    async getThemeQuestions(theme,type){
        var res
        if(type==='all')
            res=await client.query({text:"SELECT * FROM questions WHERE $1::text=theme AND delted=false", values:[theme]})
        else
            res=await client.query({text:"SELECT * FROM questions WHERE $1::text=theme AND type=$2::text AND delted=false", values:[theme,type]})        
        var {rows}=res
        return rows
    }
    async addQuestion(type,theme,level,quest,cases,answer){  //Добавляю вопросы в таблицу
        client.query({
            text:'INSERT INTO questions (type,theme,level,question,cases,answer) values ($1::text,$2::text,$3,$4::text,$5::text,$6::text)',
            values: [type,theme,level,quest,cases,answer]
        },(err,res)=>{
            if(err)
            {
                if(err.constraint!=='questions_question_key'){
                    console.log(err)
                }
            }
                
        })
    }
    async customGet(request){
        return await client.query(request)
    }
    async customAdd(request){
        client.query(request)
    }
}
module.exports.myPg=myPg