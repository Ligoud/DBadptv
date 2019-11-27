var IDs=[]

document.getElementById('start').addEventListener('click',(e)=>{
    if(e.target){
        e.target.setAttribute('data-disabled','')
        document.getElementById('bottom').removeAttribute('data-disabled')
        document.getElementById('question').removeAttribute('data-disabled')
        document.getElementById('answer').removeAttribute('data-disabled')
        //
        var xhr=new XMLHttpRequest()
        xhr.open(
            "GET",
            window.location.href+'/startTest'
        )
        xhr.onload=()=>{
            if(xhr.readyState===4)  //done
            {
                if(xhr.status===200){    //ok
                    var IDs=JSON.parse(xhr.response).arrID.map(el=>{
                        return el.questid
                    })
                    requestQuestion(IDs[0])
                }else
                    console.log(xhr.statusText)
            }
        }
        xhr.send()
    }
})

function requestQuestion(id){
    var xhr=new XMLHttpRequest()
    var url=window.location.href+'/getQuestion/'+id
    xhr.open(
        "GET",
        url
    )    
    xhr.onload=()=>{
        if(xhr.readyState===4)  //done
        {
            if(xhr.status===200){    //ok
                var res=JSON.parse(xhr.response).question
                setQuestion(res)
            }else
                console.log(xhr.statusText)
        }
    }
    xhr.send()
}

function setQuestion(questObj){
    document.querySelector('#question code').innerText=questObj[0].question
    if(questObj[0].cases==='-'){
        createOpen()
    }else{
        createCases('c1;;c2;;c3;;c4')
    }
}
function createOpen(){
    document.getElementById('openExample').removeAttribute('data-disabled')
}
function createCases(cases){
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