document.getElementById('start').addEventListener('click',(e)=>{
    if(e.target){
        e.target.setAttribute('data-disabled','')
        document.getElementById('bottom').removeAttribute('data-disabled')
        document.getElementById('question').removeAttribute('data-disabled')
        document.getElementById('answer').removeAttribute('data-disabled')
    }
})