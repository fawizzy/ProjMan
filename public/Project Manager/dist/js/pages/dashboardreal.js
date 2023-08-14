$(function(){
    
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/projectbyprojectmanager",
        contentType: 'application/json'
    }).done((data)=>{
        $("#project_number").text(data.length)
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })
})