const {myPg}=require('./postgre')
var pg=new myPg()  
//Модуль тестирования. Обертка для всех действий
class Test{
    constructor(){
        this.users={}
    }
    async getQuestion(login){
        var quest=[]
        //Вопросов должно быть достаточное количество (как минимум 20 в каждом лвле)
        quest=await pg.getRandomQuestion(this.users[login].currentlvl,this.users[login].testedquestions)
        if(quest.length===0)
            quest=await pg.getRandomQuestion(this.users[login].currentlvl,[])
        this.users[login].testedquestions.add(quest[0].questid)
        return quest[0] //Возвращаю объект вопроса
    }
    async getStarded(login){    //Проверяем с чего начать тестирование
        this.users[login]={}
        this.users[login].currentlvl=1
        this.users[login].testedquestions=new Set()
        this.users[login].rights=0  //Верные ответы на данном уровне
        this.users[login].wrongs=0  //Неверные ответы на данном уровне
        this.users[login].rightAnswers=[]
        this.users[login].answers=[]    //Ответы пользователя
        this.users[login].ids=[] //id вопросов
        this.users[login].result=[] //bool правильный ли ответ
        this.users[login].totalRights=0   //Общее количество верных ответов
        this.users[login].totalWrongs=0 //Общее количество неверных
        this.users[login].totalQuests=0
        var res=await pg.getUserAverageLevel(login)
        if(res[0].al!==null)
            this.users[login].currentlvl=res[0].al
    }
    getRightAnswers(login){
        return this.users[login].rightAnswers
    }
    getLevel(login){
        return this.users[login].currentlvl
    }
    async checkAnswer(answerObj){   //Тут ошибка integer=text 
        var res=await pg.checkQuestion(answerObj.questid,answerObj.answer)
        this.users[answerObj.login].totalQuests++
        this.users[answerObj.login].rightAnswers.push(res.rightAnswer)
        this.users[answerObj.login].ids.push(answerObj.questid)
        this.users[answerObj.login].result.push(res.isRight)
        this.users[answerObj.login].answers.push(answerObj.answer)
        if(res.isRight){    //Если ответ верный
            this.users[answerObj.login].totalRights++
            this.users[answerObj.login].rights++    //Увеличиваю правильные ответы
            let r=this.users[answerObj.login].rights,
                w=this.users[answerObj.login].wrongs,
                t=r+w
            if(t>2){
                if(r/t>=0.65){  //Переход на следующий уровень
                    this.users[answerObj.login].currentlvl++
                    this.users[answerObj.login].wrongs=0
                    this.users[answerObj.login].rights=0
                }
            }
        }else{
            this.users[answerObj.login].totalWrongs++
            this.users[answerObj.login].wrongs++    //Увеличиваю неправильные
            let r=this.users[answerObj.login].rights,
                w=this.users[answerObj.login].wrongs,
                t=r+w
            if(t>2){
                //console.log(r,w,r/t)
                if(r/t<=0.25){
                    if(this.users[answerObj.login].currentlvl>1)
                        this.users[answerObj.login].currentlvl--
                    //Я специально сбрасываю стату даже если не уменьшается уровень
                    this.users[answerObj.login].wrongs=0
                    this.users[answerObj.login].rights=0
                }
            }
        }
        var obj={
            right:res.isRight,
            endtest:false,
            
        }
        if(this.users[answerObj.login].totalQuests===20){
            obj.endtest=true
            let resultObj={
                userid: answerObj.login,
                level: this.users[answerObj.login].currentlvl,
                rights: this.users[answerObj.login].totalRights,
                wrongs: this.users[answerObj.login].totalWrongs
            }
            let resultInfoObj={ //arrays all fields
                questids: this.users[answerObj.login].ids,
                answers: this.users[answerObj.login].answers,
                results: this.users[answerObj.login].result
            }
            //Тут тест запоминать
            pg.addTestResult(resultObj,resultInfoObj)
        }
        return obj
    }
}

module.exports.Test=Test