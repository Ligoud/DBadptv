var {Client}=require('pg')
var uri='postgres://postgres:4049@localhost:5432/dbtest'
var client=new Client({
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
        client.query("create table if not exists users (name varchar(50) default 'user', UserID serial PRIMARY KEY, password text default '123');",(err,res)=>{
            if(err)
                console.error(err)
        })
        client.query("create table if not exists userInfo (UserID integer PRIMARY KEY references users(UserId),role text default 'student', mygroup varchar(10) default '-');",(err,res)=>{
            if(err)
                console.error(err)
        })
        client.query("create table if not exists questions (questID serial PRIMARY KEY,theme text default 'neutral',level integer NOT NULL,question text NOT NULL UNIQUE, cases text default '-',answer text NOT NULL, delted bool default false);",(err,res)=>{
            if(err)
                console.error(err)
        })
        //тут же триггеры и пользовательские функции создать
    }
    async getQuestionThemes(){     //Получаю темы из таблицы
        const {rows}=await client.query({                   //AWAIT не работает. придумать с промизом
            text: "SELECT DISTINCT theme FROM questions ",
        },(err,res)=>{
            if(err)
                console.log(err)
        })           
        return rows     
    }
    async add(tabName,fields,vals){
        console.log(typeof fields)
        client.query('INSERT INTO '+tabName+' ('+fields+') values ('+vals+');',(err,res)=>{
            if(err)
                console.log(err)
        })
    }
    async addQuestion(theme,level,quest,cases,answer){  //Добавляю вопросы в таблицу
        client.query({
            text:'INSERT INTO questions (theme,level,question,cases,answer) values ($1::text,$2,$3::text,$4::text,$5::text)',
            values: [theme,level,quest,cases,answer]
        },(err,res)=>{
            if(err)
                console.log(err)
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