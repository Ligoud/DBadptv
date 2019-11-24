window.addEventListener('load',function(){
    console.log('kek')
    const login=window.sessionStorage.getItem('login'),
        role=window.sessionStorage.getItem('role')
    if(role){
        var btns=document.getElementsByClassName('btn')
        
        btns[0].classList.toggle('disabled')
        if(role=='admin')
            btns[1].classList.toggle('disabled')
        
        document.getElementById('loginName').innerText='Вы вошли как '+login
    }
})

document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('disabled') || e.target.parentElement.classList.contains('disabled')){
        e.preventDefault()
        e.stopPropagation()
    }
})