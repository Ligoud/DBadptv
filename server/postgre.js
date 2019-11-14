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
        client.query("create table if not exists questions (questID serial PRIMARY KEY,question text NOT NULL, cases text default '-',answer text NOT NULL, delted bool default false);",(err,res)=>{
            if(err)
                console.error(err)
        })
        //тут же триггеры и пользовательские функции создать
    }
    async get(condition,res){   //REWOOOOOORK !!!!!!!
        return await client.query({                
            text: "SELECT $r FROM questions WHERE $c",
            values: [res,condition]
        })                
    }
    async add(tabName,fields,vals){
        console.log(typeof fields)
        client.query('INSERT INTO '+tabName+' ('+fields+') values ('+vals+');',(err,res)=>{
            if(err)
                console.log(err)
        })
    }
    async addQuestion(quest,cases,answer){
        client.query({
            text:'INSERT INTO questions (question,cases,answer) values ($1::text,$2::text,$3::text)',
            values: [quest,cases,answer]
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