//Текст парсер с целью разбора вопросов
const path=require('path')

var currentType=''

var header={
    level: 0,
    theme: ''
}
var statement={
    block: ''
}
var question={
    theme:'',
    level:0,
    quest:'',
    answ:''
}
var globalRes=[]

class Parser{    
    constructor(){

    }
    async checkFile(readline){
        let promise=new Promise((resolve,reject)=>{

        var endBlock=true,endQuest=true
        var result=[]
        //console.log('started new')
        readline.on('line',(line)=>{
            //console.log(line)            
            //line=line.replace(/\s/g,'')            
            line=line.trimLeft()
            //console.log(line)
            let splted=[]
            if(line==='}#'){
                //console.log(endQuest+' '+endBlock)
                if(!endQuest){
                    endQuest=true
                    //console.log(question) 
                    question.level=header.level
                    question.theme=header.theme.trim() 
                    question.type=currentType
                    globalRes.push(question)
                    question={} //УДАЛИТЬ ССЫЛКУ НА СТАРТОВЫЙ ОБЪЕКТ
                    //question.cases='-'
                }
                else if(!endBlock){
                    //console.log('block '+statement.block+' ends')
                    endBlock=true  
                }      
            }else{
                switch (statement.block) {
                    case '':      
                        statement.block=line.split(' ')[0].slice(0,-1)
                        endBlock=false
                        break;
                    case 'header':            
                        if(endBlock)
                        {
                            statement.block=line.split(' ')[0].slice(0,-1)
                            endBlock=false
                        }else{                       
                            splted=line.split(':')
                            switch(splted[0]){
                                case 'level':
                                    header.level=splted[1]
                                    break
                                case 'theme':
                                    header.theme=splted[1]
                                    break
                                default:
                                    break
                            }
                        }
                        break;
                    case 'block':
                        if(endBlock)
                        {
                            statement.block=line.split(' ')[0].slice(0,-1)
                            endBlock=false
                        }else{
                            //Внутри блока значит (question block)
                            statement.block=line.split(' ')[0].slice(0,-1)
                            endQuest=false
                        }
                        break;
                    case 'question':         
                        if(endQuest){                    
                            statement.block=line.split(' ')[0].slice(0,-1)
                            if(endBlock)    //Не вопрос
                                endBlock=false
                            else   //Значит еще 1 вопрос
                                endQuest=false
                        }else{
                            splted=line.split(':')
                            switch(splted[0]){
                                case 'quest':
                                    question.quest=splted.slice(1).join(' ').trim()
                                    break
                                case 'answ':
                                    question.answ=splted.slice(1).join(' ').trim()
                                    break
                                case 'cases':
                                    question.cases=splted.slice(1).join(' ')
                                    break
                                default:
                                    break
                            }
                        }
                        break
                    default:
                        //тут скип всего блока сделать
                        break;
                }
            }
        })
        readline.on('close',()=>{
            resolve('done')
        })        
        })  //promise заканчивается
        
        await promise
    }
    async checkFiles(){ //Форсит на чтение всех файлов
        globalRes=[]
        let prom=new Promise((resolve,reject)=>{
        
        var readline=require('readline').createInterface({
            input: require('fs').createReadStream(path.join(__dirname,'questions','daf.txt'))
        })
        let filesToRead=[]
        readline.on('line',(str)=>{
            console.log(str)
            filesToRead.push(str)
        })
        readline.on('close',async ()=>{
            console.log(filesToRead)
            for(let i=0;i<filesToRead.length;i++){
                currentType=filesToRead[i].split('.')[0]
                let rline=require('readline').createInterface({
                    input: require('fs').createReadStream(path.join(__dirname,'questions',filesToRead[i]))
                })                
                await this.checkFile(rline)
            } 
            resolve('done')
        })              //end of 'close' event
        })//promise ends    
        await prom
        return globalRes;
    }    
}
/*var prsr=new Parser()
prsr.checkFiles()*/
module.exports.Parser=Parser;