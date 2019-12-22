var allQuestions=[]
var TestEnds=false
document.getElementById('start').addEventListener('click',(e)=>{
    if(e.target){
        document.getElementById('start').setAttribute('data-disabled','')
        document.getElementById('bottom').removeAttribute('data-disabled')
        document.getElementById('question').removeAttribute('data-disabled')
        document.getElementById('answer').removeAttribute('data-disabled')
        //
        var xhr=new XMLHttpRequest()
        xhr.open(
            "GET",
            window.location.href+'/startTest/'+window.sessionStorage.getItem('login')
        )
        xhr.onload=()=>{
            if(xhr.readyState===4)  //done
            {
                if(xhr.status===200){    //ok
                    var res=JSON.parse(xhr.response)
                    allQuestions.push(res)
                    setQuestion(res)
                }else
                    console.log(xhr.statusText)
            }
        }
        xhr.send()
    }
})

function setQuestion(questObj){     //Отрисовка вопросов на странице
    document.getElementById('answer').innerHTML=''    
    document.querySelector('#question code').innerText=questObj.question
    document.querySelector('#map ul').innerHTML+='<li name="li'+allQuestions.length+'" onclick="li_clicked(event)">'+allQuestions.length
    console.log(questObj)
    if(questObj.type==='openQuest'){
        createOpen()
    }else if(questObj.type==='casesQuest'){
        createCases(questObj.cases)
    }
}
function li_clicked(ev) {   //Если сам пользователь просматривает прошлые вопросы
    document.getElementById('answer').innerHTML=''
    const num= +ev.target.getAttribute('name').slice(2)
    const clicked_quest = allQuestions[num-1]
    document.querySelector('#question code').innerText=clicked_quest.question    
    if(clicked_quest.type==='openQuest')
        createOpen()
    else
        createCases(clicked_quest.cases)
    if(num===allQuestions.length && !TestEnds){
        document.getElementById('bottom').removeAttribute('data-disabled')
    }else{
        document.getElementById('bottom').setAttribute('data-disabled','')
    }
    document.getElementById('result').setAttribute('data-disabled','')
    document.getElementById('question').removeAttribute('data-disabled')
    document.getElementById('answer').removeAttribute('data-disabled')
}
//var cbox=document.getElementById('checkboxExample').cloneNode(true)
var openInput=document.getElementById('openExample').cloneNode(true)
function createOpen(answered=''){  //Открывает форму для ввода ответа
    openInput.removeAttribute('data-disabled')
    openInput.value=answered
    document.getElementById('answer').insertAdjacentElement('beforeend',openInput)
}
function createCases(cases){   //На вход получает строку с вариантами ответа на выходе - отображение на страничке вариантов ответа
    console.log(cases)
    var arr=cases
    var col=1,row=1,i=1
    var divel=document.createElement('div')
    divel.setAttribute('id','checkboxExample')            
    arr.forEach(el => {    
        console.log(el)    
        var label=document.createElement('label'),
            input=document.createElement('input')
            span=document.createElement('span')
        //var check=cbox.children[0].children[0]              
        //console.log(cbox)
        if(el!=='' && el.replace(/\s/g,'')!==''){
            span.innerText=el
            input.name='case'+i
            input.classList.add(('col'+col),('row'+row))        
            input.setAttribute('type','checkbox')
            row++
            i++        
            if(row>3){
                row=1
                col++
            }
            if(col>3)
                col=1
            label.insertAdjacentElement('beforeend',input)
            label.insertAdjacentElement('beforeend',span)            
            divel.insertAdjacentElement('beforeend',label)
        }
    });
    document.getElementById('answer').insertAdjacentElement('beforeend',divel)
}
var asnwerButton=(ev)=>{   //Пользоавтель нажал на ответить на вопрос
    var obj={}        
    const currQuest=allQuestions[allQuestions.length-1]
    obj.questid=currQuest.questid
    obj.answer=''
    obj.login=window.sessionStorage.getItem('login')
    if(ev.target.classList.contains('Accept')){
        if(currQuest.type==='openQuest'){
            obj.answer=document.getElementById('txtarea').value
        }
        else if(currQuest.type==='casesQuest'){
            console.log('CASES')
            chks=document.querySelectorAll('[type="checkbox"]')
            chks.forEach(el=>{
                if(el.checked)
                    obj.answer+=document.getElementsByName(el.name)[0].nextElementSibling.innerText+';'
            })
            if(obj.answer!=='')
                obj.answer=obj.answer.slice(0,-1)
        }
        obj.answer=obj.answer.toLowerCase()
        obj.answer=obj.answer.replace(/\n/,'').trim()
        console.log(obj)
    }
    if(document.querySelector('#txtarea'))
        document.querySelector('#txtarea').value=''

    allQuestions[allQuestions.length-1].userAns=obj.answer
    var formData=new FormData()
    var xhr=new XMLHttpRequest()
    formData.append('answer',JSON.stringify(obj))
    
    xhr.open(
        'POST',
        window.location.href+'/answer'
    )
    xhr.onload=()=>{
        if(xhr.readyState===4)
        {
            if(xhr.status===200){
                var res=JSON.parse(xhr.response)
                var alertRow=''
                if(res.isRight){
                    document.querySelector('li[name="li'+allQuestions.length+'"]').setAttribute('right','')
                    alertRow="Вы ответили правильно!"
                }else{
                    document.querySelector('li[name="li'+allQuestions.length+'"]').setAttribute('failed','')
                    alertRow="Вы ответили неверно!"
                }
                if(res.endtest===true){
                    //Вывести страницу окончания тестирования
                    alertRow+='\n\nТестирование завершено'
                    document.querySelector('#map ul').innerHTML+='<li onclick="res_clicked(event)" ><b>!</b>'
                    TestEnds=true
                    endTest(res.rightAnswers,res.level)
                    console.log(res)
                }else{  //Отрисовка следующего вопроса тут                    
                    allQuestions.push(res.question)
                    console.log(allQuestions)
                    setQuestion(res.question)
                }
                alert(alertRow)
            }else{
                console.log(xhr.status)
            }
        }
    }
    xhr.send(formData)
}
document.getElementsByClassName('Accept')[0].addEventListener('click',asnwerButton)
document.getElementsByClassName('Skip')[0].addEventListener('click',asnwerButton)
function res_clicked(ev='') {
    document.getElementById('result').removeAttribute('data-disabled')
    document.getElementById('question').setAttribute('data-disabled','')
    document.getElementById('answer').setAttribute('data-disabled','')
    document.getElementById('bottom').setAttribute('data-disabled','')
}
function endTest(rightAnswers,level) {
    var tbl=document.querySelector('table')
    for(let i=0;i<20;i++){
        var tr=document.createElement('tr'),
            td1=document.createElement('td'),
            td2=document.createElement('td'),
            td3=document.createElement('td')
        td1.innerText=allQuestions[i].questid
        td2.innerText=allQuestions[i].userAns
        td3.innerText=rightAnswers[i]
        tr.insertAdjacentElement('beforeend',td1)
        tr.insertAdjacentElement('beforeend',td2)
        tr.insertAdjacentElement('beforeend',td3)        
        tbl.insertAdjacentElement('beforeend',tr)        
    }
    var trr=document.createElement('tr'),
        tdr=document.createElement('td')
    tdr.setAttribute('colspan','3')
    tdr.innerText='Вы остановились на '+level+'м уровне сложности вопросов'
    trr.insertAdjacentElement('beforeend',tdr)
    tbl.insertAdjacentElement('beforeend',trr)

    res_clicked()
}
document.querySelector('th').addEventListener('click',endTest)
