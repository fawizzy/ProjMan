$(function(){

    $("#assignuserform").submit(function(event){
        event.preventDefault()
        const selectedValues = []
        var selectedmember = $("#member_dropdown").find("option:selected").data("team-member");
        var selectedproject = $("#project_dropdown").find("option:selected").data("project-member");
        const data = {
            user_id: selectedmember.id,
            project_id: selectedproject.id
        }
        $.ajax({
            type: "PUT",
            url: "http://localhost:5000/assignuser",
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).done((data)=>{
            console.log(data)
                })
        
    })
    const team_member_list = []
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/projectbyprojectmanager",
        contentType: 'application/json'
    }).done((data)=>{
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/teambyprojectmanager",
                data: JSON.stringify({
                }),
                contentType: 'application/json'
                
            }).done((teammembers)=>{
                teammembers.forEach(teammember => {
                    $("#member_dropdown").append(`<option data-team-member='${JSON.stringify(teammember)}'>${teammember.email}</option>`);
                });
                
                
            })
        
        createProjectTable(data)
        $("#example1").DataTable({
            "responsive": true, "lengthChange": false, "autoWidth": false,
            "buttons": [""]
          }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    });


    
    

    function createProjectTable(projects) {
        const projectTable = $(`
                            <table width="80%" id="example1">
                            <thead>
                            <tr>
                            <th>Project Name</th>
                            <th>Start Date</th>
                            <th>End Date </th>
                            </tr>
                            </thead>
                            <tbody id="tbody">
                                        
                            </tbody>
                            `).addClass("projectTable");
        
        projects.forEach(project => {
            $("#project_dropdown").append(`<option data-project-member='${JSON.stringify(project)}'>${project.project_name}</option>`);
            
            //$("#project_dropdown").append(`<option>${project.project_name}</option>`)
            const projectRow = $(`<tr>
                                <td>${project.project_name}</td>
                                <td>${formatDateToDDMM(project.start_date)}</td>
                                <td>${formatDateToDDMM(project.end_date)}</td>
                                `).addClass("projectRow");
          
            projectRow.data("projectId", project.id); // Store project id for later use
            projectTable.append(projectRow);
            
            $("#projectTableContainer").append(projectTable);
            
        $(".projectRow").css("cursor", "pointer").click(function() {
            const projectId = $(this).data("projectId");
            //   Fetch tasks data using AJAX based on the project id
            
            $.ajax({
            type: "POST",
            url: "http://localhost:5000/projectteammembers",
            data: JSON.stringify({
                    project_id: project.project_id
                }),
                contentType: 'application/json'
                
            }).done((teammembers)=>{
                team_member_list.push(teammembers)
                const taskTable = $("<table>").addClass("taskTable");
                if (Array.isArray(teammembers)){
                    teammembers.forEach(teammember => {
                        
                        const taskRow = $(`<thead>
                        <tr width="100%">
                          <th style="padding-right:50px; padding-left: 50px">Name</th>
                          <th style="padding-right:0px">email</th>
                        </tr>
                        </thead>`);
                        taskRow.append($(`<tr>
                                         <td style="padding-left:50px">${teammember.username}</td>
                                          <td style="padding-right:10px">${teammember.email}</td>
                                          </tr>`));
                        taskRow.append($("<td></td>"))
                        taskTable.append(taskRow);
                    });
                } else {
                    const taskRow = $("<tr>");
                    taskRow.append($(`<td style="padding-left:170px">No member for thid project yet</td>`));
                    taskTable.append(taskRow);
                }
                
                
                const existingTaskTable = $(this).next(".taskTable");
                if (existingTaskTable.length) {
                existingTaskTable.remove();
                } else {
                $(this).after(taskTable);
                }
            }).bind(this)
            console.log(team_member_list)
        });
        });
        
    }

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
   
        
