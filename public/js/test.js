var allQuestions=[]
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
    document.querySelector('#question code').innerText=questObj.question
    if(questObj.type==='openQuest'){
        createOpen()
    }else if(questObj.type==='casesQuest'){
        createCases('c1;;c2;;c3;;c4')
    }
}
function createOpen(){  //Открывает форму для ввода ответа
    console.log('OPEN')
    document.getElementById('openExample').removeAttribute('data-disabled')
}
function createCases(cases){   //На вход получает строку с вариантами ответа на выходе - отображение на страничке вариантов ответа
    var arr=cases.split(';;')
    var col=1,row=1,i=1
    arr.forEach(el => {
        console.log(el)
        var cbox=document.getElementById('checkboxExample').cloneNode(true)
        cbox.removeAttribute('data-disabled')
        var check=cbox.children[0].children[0]              
        //console.log(cbox)
        cbox.children[0].children[1].innerText=el
        check.name='case'+i
        check.classList.add(('col'+col),('row'+row))        
        row++
        i++        
        if(row>3){
            row=1
            col++
        }
        if(col>3)
            col=1
        document.getElementById('answer').insertAdjacentElement('beforeend',cbox)
    });
}

document.getElementsByClassName('Accept')[0].addEventListener('click',(ev)=>{   //Пользоавтель нажал на ответить на вопрос
    var obj={}
    const currQuest=allQuestions[allQuestions.length-1]
    obj.questid=currQuest.questid
    obj.answer=''
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
    console.log(obj)
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
                if(res.endtest!==undefined){
                    //Вывести страницу окончания тестирования
                }else{
                    var res=JSON.parse(xhr.response)
                    allQuestions.push(res)
                    setQuestion(res)
                }
            }else{
                console.log(xhr.status)
            }
        }
    }
    xhr.send(formData)
})