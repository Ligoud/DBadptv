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

    }
    createTables(){

    }
}
module.exports.myPg=myPg