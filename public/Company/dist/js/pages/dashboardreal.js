$(function(){
    
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/allprojectmanagers",
        contentType: 'application/json'
    }).done((data)=>{
        console.log(data)
        $("#project_manager_number").text(data.length)
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })

    $.ajax({
        type: "GET",
        url: "http://localhost:5000/allprojects",
        contentType: 'application/json'
    }).done((data)=>{
        console.log(data)
        $("#project_number").text(data.length)
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })

    $.ajax({
        type: "GET",
        url: "http://localhost:5000/allprojects",
        contentType: 'application/json'
    }).done((data)=>{
        console.log(data)
        $("#project_number").text(data.length)
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })

    $.ajax({
        type: "GET",
        url: "http://localhost:5000/currentuser",
        contentType: 'application/json'
    }).done((user)=>{
        console.log(user)
        $("#admin").text(user.username)
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })
})