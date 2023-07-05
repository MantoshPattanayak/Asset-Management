
$(document).ready(function(){
    $('#audit-submit').on('click', function(event) {
        event.preventDefault(); // Prevent form submission
    
        let employeeNumber = $('#fieldName').val();
        let fromDate = $('#startDate').val();
        let toDate = $('#endDate').val();
    
        // Function to format the date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            let hours = date.getHours().toString().padStart(2, '0');
            let minutes = date.getMinutes().toString().padStart(2, '0');
            let seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        if(new Date($('#startDate').val()).toISOString() < new Date($('#endDate').val()).toISOString()){
            $.ajax({
                url: `http://localhost:3000/audit-report/submitData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
                type: 'GET',
                success: function(response){
                    console.log(response);
                    // Handle the data
                    var tableContainer = document.getElementById('tableContainer');
                    tableContainer.innerHTML = ''; // Clear previous content
                
                    // Generate HTML content for the table
                    var tableHTML = `<table>
                                        <thead class="head">
                                            <tr>
                                                <th>Audit No</th>
                                                <th>Emp No</th>
                                                <th>Auditor Name</th>
                                                <th>Location Name</th>
                                                <th>Department Name</th>
                                                <th>Scheduled Start Date</th>
                                                <th>Scheduled End Date</th>
                                                <th>Total Assets Found</th>
                                                <th>Total Assets Missing</th>
                                                <th>Total Assets New</th>
                                                <th>Download</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
                    response.tableData.forEach(function(item) {
                        tableHTML += 
                                    `<tr>
                                        <td>${item.Id}</td>
                                        <td>${item.EmployeeNo}</td>
                                        <td>${item.AuditorName}</td>
                                        <td>${item.location_name}</td>
                                        <td>${item.dept_name}</td>
                                        <td>${item.ScheduledStartDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null"}</td>
                                        <td>${item.ScheduledEndDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null"}</td>
                                        <td>${item.FoundAssetCount}</td>
                                        <td>${item.MissingAssetCount}</td>
                                        <td>${item.NewAssetCount}</td>
                                        <td>
                                            <div class="csv-pdf">
                                                <button class="csv" onclick="downloadAsCSVFile(event, $(this))">CSV</button>
                                                <button class="pdf" onclick="downloadAsPDFFile(event, $(this))">PDF</button>
                                            </div>
                                      </td>
                                    </tr>`
                    });
                    tableHTML += '</tbody></table>';
                
                    // Update the HTML content in the table container
                    tableContainer.innerHTML = tableHTML;
                },
                error: function(error){
                    console.log(error);
                }
            })
        }
        else{
            alert('Start Date should be less than End Date!!!');
        }
    });
})


function checkInputValue(event){
    if (!(event.keyCode >= 48 && event.keyCode <= 57)) {
        event.preventDefault();
        return false;
    }
}

function downloadAsCSVFile(e, element){
    console.log('download CSV File!!!');
    e.preventDefault();
    
    let auditID = $(element).closest('tr').find('td').eq(0).text();

    $.ajax({
        url: `http://localhost:3000/audit-report/downloadData?auditID=${auditID}`,
        type: 'GET',
        success: function (response){

        },
        error: function (error){
            console.log('At downloadAsCSVFile: ',error);
        }
    })
}

function downloadAsPDFFile(e, element){
    console.log('download PDF File!!!');
    e.preventDefault();
    
    let auditID = $(element).closest('tr').find('td').eq(0).text();

    $.ajax({
        url: `http://localhost:3000/audit-report/downloadData?auditID=${auditID}`,
        type: 'GET',
        success: function (response){

        },
        error: function (error){
            console.log('At downloadAsCSVFile: ',error);
        }
    })
}

function exportTable(event){
    event.preventDefault();
    console.log('export func');

    let employeeNumber = $('#fieldName').val();
    let fromDate = $('#startDate').val();
    let toDate = $('#endDate').val();

    $.ajax({
        url: `http://localhost:3000//audit-report/downloadAuditData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
        type: 'GET',
        success: function (reponse){

        },
        error: function(error){
            console.log(error);
        }
    })
}