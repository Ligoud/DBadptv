
function sendForm(e){
    var xhr=new XMLHttpRequest()
    var route='/login'
    if(e.target.classList.contains('registerBtn'))
        route='/register'
    console.log(route)
    var formData=new FormData()
    formData.append('login',document.getElementsByName('login')[0].value)
    formData.append('password',document.getElementsByName('password')[0].value)
    
    xhr.open(
        'POST',
        window.location.href+route
    )
    xhr.onload=function(e){
        if(xhr.readyState===4)
        {
            if(xhr.status===200){
                console.log(JSON.parse(xhr.response))
                var result=JSON.parse(xhr.response)
                if(result.registered===undefined){
                    if(result.logedIn===true){
                        window.sessionStorage.setItem('role',result.role)
                        window.sessionStorage.setItem('login',result.login)
                        alert('Вы успешно авторизовались')
                        window.location.href='http://localhost:8080/'
                    }else
                        alert('Вы допустили ошибку в логине или пароле')
                }else{
                    if(result.registered===true)
                    {
                        alert('Вы успешно зарегистрировались')
                    }else
                        alert('Пользователь с таким логином уже существует')
                }
            }else{

            }
        }
    }
    console.log(formData.get('login'))
    xhr.send(formData)
}

document.getElementsByClassName('loginBtn')[0].addEventListener('click',sendForm)
document.getElementsByClassName('registerBtn')[0].addEventListener('click',sendForm)
