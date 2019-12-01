const {myPg}=require('./postgre')
var pg=new myPg()  
//Модуль тестирования. Обертка для всех действий
class Test{
    constructor(){
        this.users={}
    }
    async getStarded(login){    //Проверяем с чего начать тестирование и возвращаем вопрос первый
        this.users[login]={}
        this.users[login].currentlvl=1
        this.users[login].testequestions=[]
        var res=await pg.getUserAverageLevel(login)
        if(res[0].al!==null)
            this.users[login].currentlvl=res[0].al
        var quest=await pg.getRandomQuestion(this.users[login].currentlvl,this.users[login].testequestions)
        this.users[login].testequestions.push(quest[0].questid)
        return quest[0] //Возвращаю объект вопроса
    }
    async nextQuest(login){
        
    }
}

module.exports.Test=Test