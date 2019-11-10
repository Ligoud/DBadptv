//Текст парсер с целью разбора вопросов
var readline=require('readline').createInterface({
    input: require('fs').createReadStream('./questions/myfile.txt')
})
var header={
    level: 0,
    theme: ''
}
var statement={
    block: ''
}
var question={
    quest:'',
    answ:''
}
var endBlock=true,endQuest=true
console.log('kek')
readline.on('line',(line)=>{
    line=line.replace(/\s/g,'')
    let splted=[]
    if(line==='}#'){
        //console.log(endQuest+' '+endBlock)
        if(!endQuest){
            endQuest=true
            console.log(question)
        }
        else if(!endBlock){
            console.log('block '+statement.block+' ends')
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
                            question.quest=splted.join(' ')
                            break
                        case 'answ':
                            question.answ=splted.join(' ')
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