$(function(){
    let b = $("#example1 #tbody");
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/projectbyprojectmanager",
        contentType: 'application/json'
    }).done((data)=>{

        data.forEach((data)=>{
            b.append(`
            <tr>
            <td>${data.project_name}</td>
            <td>${data.project_description}</td>
            <td>${formatDateToDDMM(data.start_date)}</td>
            <td>${formatDateToDDMM(data.end_date)}</td>
            <td>${data.project_name}</td>
            <td><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#edit"><i class="fa fa-pencil-alt"></i></button> <button type="button" class="btn btn-danger btn-xs"><i class="fa fa-trash"></i></button>
            </td>
            </tr>
            `)
        })

        $("#example1").DataTable({
            "responsive": true, "lengthChange": false, "autoWidth": false,
            "buttons": [""]
          }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    }).fail ((err)=>{
        console.log(err)
    }).always(()=>{
       
    })
    
    
    function formatDateToDDMM(inputDate) {
        inputDate = inputDate.toString().slice(0,10)
        // Split the input date using '-' as the separator
        const parts = inputDate.split('-');
        
        // Ensure the date has 3 parts (year, month, day)
        if (parts.length !== 3) {
          return 'Invalid date format';
        }
        
        // Reformat the date as "DD/MM"
        const formattedDate = `${parts[2]}/${parts[1]}`;
        
        return formattedDate;
      }
        

    
})