document.getElementsByClassName('btn-1')[0].addEventListener('click',()=>{
    var radios=document.querySelectorAll('input[name="type"]')
    var type=''
    for(let i=0;i<radios.length;i++)
    {
        if(radios[i].checked){
            type=radios[i].value
        }
    }
    var x=new XMLHttpRequest()
    var url=window.location.href
    url+='/themes'
    x.open(
        'GET',
        url
    )
    x.onload=function(e){
        if(x.readyState==4) //done
        {
            if(x.status==200)   //ok
            {                
                var arr=JSON.parse(x.response).arr
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
    arrOpt.forEach(el => {
        let option=document.createElement('option')
        option.innerText=el
        select.insertAdjacentElement('beforeend',option)
    });
}
function addLine(){
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
    a.setAttribute('href','#')
    //NUM
    span2.innerText='#NUM'
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
    divDel.classList.add('delete')
    divDel.setAttribute('data-delete','')
    //
    //text
    span1.innerText='Вопрос'
    a1.insertAdjacentElement('beforeend',span1)
    divTxt.insertAdjacentElement('beforeend',a1)
    divTxt.classList.add('questPart')
    //
    divR.classList.add('row')
    divR.insertAdjacentElement('beforeend',divNum)
    divR.insertAdjacentElement('beforeend',divTxt)
    divR.insertAdjacentElement('beforeend',divDel)
    document.getElementsByClassName('questBox')[0].insertAdjacentElement('beforeend',divR)
}
document.getElementById('tss').addEventListener('click',()=>{
    addLine()
})
document.getElementById('themes').addEventListener('change',()=>{
})
document.addEventListener('click',function(e){  //Удаление строки
    if(e.target && e.target.hasAttribute('data-delete')){    
        var el=e.target
        while(!el.parentElement.classList.contains('row')){
            el=el.parentElement
        }
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
