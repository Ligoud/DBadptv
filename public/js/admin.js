var chosenType='all'
var chosenTheme=''
var isDeleted=false

function updateHeader(){
    var delText=isDeleted? 'удаленных ': ''
    var forHeaderText='Список '+delText+'вопросов по теме "'+chosenTheme+'"'
        if(chosenType==='all')
            forHeaderText+=' для всех типов вопросов'
        else if(chosenType==='openQuest')
           forHeaderText+=' для открытых вопросов'
        else
            forHeaderText+=' для вопросов с вариантами ответа'
    document.getElementById('header').innerText=forHeaderText
}

document.getElementsByClassName('btn-1')[0].addEventListener('click',()=>{
    var radios=document.querySelectorAll('input[name="type"]')    
    for(let i=0;i<radios.length;i++)
    {
        if(radios[i].checked){
            chosenType=radios[i].value
        }
    }
    //Обновляю заголовк страницы
    //
    var x=new XMLHttpRequest()
    var url=window.location.href+'/themes/'+chosenType
    x.open(
        'GET',
        url
    )
    //alert(url)
    x.onload=function(e){
        if(x.readyState==4) //done
        {
            if(x.status==200)   //ok
            {                
                var arr=JSON.parse(x.response).arr
                //console.log(x.response)
                updateOptions(arr)
            }else{  //not ok
                alert(x.statusText)
            }
        }
    }
    x.send()
})
function updateOptions(arrOpt){
    var select=document.getElementById('themes')
    select.innerHTML=''
    var startOpt=document.createElement('option')
    startOpt.innerText='Темы не выбраны'
    startOpt.setAttribute('disabled','')
    startOpt.setAttribute('selected','')
    startOpt.setAttribute('value','')
    select.insertAdjacentElement('beforeend',startOpt)
    arrOpt.forEach(el => {
        let option=document.createElement('option')
        option.innerText=el
        select.insertAdjacentElement('beforeend',option)
    });
}
function addLine(id='NUM',question='question'){
    var divR=document.createElement('div'),
        divTxt=document.createElement('div'),
        divDel=document.createElement('div'),
        divNum=document.createElement('div'),
        a=document.createElement('a'),
        a1=document.createElement('a'),
        a2=document.createElement('a'),
        span=document.createElement('span'),
        span1=document.createElement('span'),
        span2=document.createElement('span')
    a.setAttribute('href','')
    //NUM
    span2.innerText=id
    a2.insertAdjacentElement('beforeend',span2)
    divNum.insertAdjacentElement('beforeend',a2)
    divNum.classList.add('questID')
    //
    //X
    span.innerText='X'
    span.setAttribute('data-delete','')
    a.insertAdjacentElement('beforeend',span)   //X сделано
    a.setAttribute('data-delete','')
    divDel.insertAdjacentElement('beforeend',a) //div X сделан
    let classdel=isDeleted?'undelete':'delete'
    divDel.classList.add(classdel)
    divDel.setAttribute('data-delete','')
    divDel.setAttribute('data-idRow',id)
    //
    //text
    span1.innerText=question
    a1.insertAdjacentElement('beforeend',span1)
    divTxt.insertAdjacentElement('beforeend',a1)
    divTxt.classList.add('questPart')
    divTxt.setAttribute('data-id',id)
    divTxt.addEventListener('click',change)
    //
    divR.classList.add('row')
    divR.insertAdjacentElement('beforeend',divNum)
    divR.insertAdjacentElement('beforeend',divTxt)
    divR.insertAdjacentElement('beforeend',divDel)
    document.getElementsByClassName('questBox')[0].insertAdjacentElement('beforeend',divR)
}
function selectChange(ev){  //Выбор темы из списка
    isDeleted=document.getElementById('cb1').checked  //Какие вопросы показывать - удаленные или нет
    console.log(isDeleted)
    var xhr=new XMLHttpRequest()    
    chosenTheme=ev.target.options[ev.target.selectedIndex].value
    
    xhr.open(
        'GET',
        window.location.href+'/themes/'+chosenType+'/'+chosenTheme+'/'+isDeleted
    )
    xhr.onload=function(e){
        if(xhr.readyState==4) //done
        {
            if(xhr.status==200){   //ok
                let result=JSON.parse(xhr.response)                                
                document.getElementsByClassName('questBox')[0].innerHTML=''
                updateHeader()
                result.forEach(el=>{
                    addLine(el.questid,el.question)
                })
            }else{
                console.log(xhr.statusText)
            }
        }
    }
    xhr.send()
}
document.getElementById('themes').addEventListener('change',selectChange)   //Выбор темы в селекторе
document.addEventListener('click',function(e){  //Удаление строки
    if(e.target && e.target.hasAttribute('data-delete')){    
        var el=e.target
        while(!el.parentElement.classList.contains('row')){
            el=el.parentElement
        }
        
        xhr=new XMLHttpRequest()
        xhr.open(
            'DELETE',
            window.location.href+'/'+el.getAttribute('data-idRow')+'/'+isDeleted
        )
        xhr.send()
        alert(isDeleted?'Вопрос был восстановлен':'Вопрос был удален')
        el.parentElement.parentElement.removeChild(el.parentElement)
    }
})
document.getElementsByClassName('btn-2')[0].addEventListener('click',()=>{
    var x=new XMLHttpRequest()
    var url=window.location.href
    url+='/checkfiles'
    x.open(
        'GET',
        url
    )
    //alert(url)
    x.onload=function(e){
        if(x.readyState==4) //done
        {
            if(x.status==200)   //ok
            {                
                if(x.responseText==='true')
                {
                    alert('Вопросы были добавлены')
                }
            }else{  //not ok
                alert(x.statusText)
            }
        }
    }
    x.send()
})

function changeBoxCreate(quest){
    document.getElementById('disableWindow').removeAttribute('data-disabled')
    document.getElementById('questionEdit').innerText=quest.question
    document.getElementById('answerEdit').innerText=quest.answer
    document.getElementById('casesEdit').innerText=quest.cases
}
//document.getElementsByClassName('questPart').addEventListener('')
var ID=0
function change(ev) { 
    var xhr=new XMLHttpRequest()
    var el=ev.target
    while(!el.classList.contains('questPart')){
        el=el.parentElement
    }
    var id=el.getAttribute('data-id')
    ID=id
    xhr.open(
        'GET',
        window.location.href+'/getQuest/'+id
    )
    console.log('asdasd')
    xhr.onload=function(e){
        if(xhr.readyState==4)//ok
        {
            if(xhr.status==200){
                var res=JSON.parse(xhr.response)
                console.log(res)
                changeBoxCreate(res[0])
            }else{
                console.log(xhr.statusText)
            }
        }
    }
    xhr.send()
    //////////////////
}
document.getElementById('close').addEventListener('click',(ev)=>{
    document.getElementById('disableWindow').setAttribute('data-disabled','')
})
document.getElementById('ok').addEventListener('click',(ev)=>{
    var xhr=new XMLHttpRequest()
    xhr.open(
        'POST',
        window.location.href+'/changeQuest'
    )
    var formdata=new FormData()
    formdata.append('question',document.getElementById('questionEdit').value)
    formdata.append('answer',document.getElementById('answerEdit').value)
    formdata.append('cases',document.getElementById('casesEdit').value)
    console.log(ID)
    formdata.append('id',ID)
    xhr.send(formdata)
    alert('Вопрос был изменен')
})