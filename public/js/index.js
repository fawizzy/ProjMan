
$(document).ready(function(){
    
    $("form").submit(function(event){
        event.preventDefault()
        let x = $("form").serializeArray()
        let data = 1
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/login",
            data: JSON.stringify({
                email: x[0].value,
                password: x[1].value
            }),
            contentType: 'application/json'
        }).done((data)=>{
            console.log(data)
            window.location.replace("Project Manager/dashboard.html")
        }).fail ((err)=>{
            console.log(err)
        }).always(()=>{
            console.log(x[0].value)
        })

        
        
    })
 })
