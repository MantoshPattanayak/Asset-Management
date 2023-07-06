$(document).ready(function(){
    if (sessionStorage.getItem('sessionVar') != 'pass') {
        window.location.href = `./index.html`;
      }
    $('#audit-submit').on('click', function(event) {
        event.preventDefault(); // Prevent form submission
    
        let employeeNumber = $('#fieldName').val();
        let fromDate = $('#startDate').val();
        let toDate = $('#endDate').val();

         // Check if fromDate and toDate are empty
         if (fromDate === '' || toDate === '') {
            alert('Please select both Start Date and End Date.');
            return; // Stop further execution
        }
    
    
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

// function exportTable(event){
//     event.preventDefault();
//     console.log('export func');

//     let employeeNumber = $('#fieldName').val();
//     let fromDate = $('#startDate').val();
//     let toDate = $('#endDate').val();

//     $.ajax({
//         url: `http://localhost:3000//audit-report/downloadAuditData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
//         type: 'GET',
//         success: function (reponse){

//         },
//         error: function(error){
//             console.log(error);
//         }
//     })
// }

/***Export Table */
function exportTable(event) {
    event.preventDefault();
    console.log('export func');
  
    let employeeNumber = $('#fieldName').val();
    let fromDate = $('#startDate').val();
    let toDate = $('#endDate').val();
  
    // Generate PDF report
    if(fromDate != '' && toDate != ''){
        generatePDFReport(employeeNumber, fromDate, toDate);
    }
  }
  
function generatePDFReport(employeeNumber, fromDate, toDate) {
    // Create a new jsPDF instance
    var doc = new jsPDF();

    // Fetch the data from the server
    $.ajax({
        url: `http://localhost:3000/audit-report/downloadAuditData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
        type: 'GET',
        success: function(response) {
        // Handle the data
        console.log(response);
        var tableData = response.auditTableData;

        // Format the date
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

        // Set the table header
        var tableHeader = ['Audit No', 'Emp No', 'Auditor Name', 'Location Name', 'Department Name', 'Scheduled Start Date', 'Scheduled End Date', 'Total Assets Found', 'Total Assets Missing', 'Total Assets New'];

        // Set the table rows
        var tableRows = tableData.map(function(item) {
            return [
            item.Id,
            item.EmployeeNo,
            item.AuditorName,
            item.location_name,
            item.dept_name,
            item.ScheduledStartDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null",
            item.ScheduledEndDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null",
            item.FoundAssetCount,
            item.MissingAssetCount,
            item.NewAssetCount
            ];
        });

        // Set the table options
        var tableOptions = {
            theme: 'grid',
            styles: {
            overflow: 'linebreak'
            },
            headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
            },
            footStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
            },
            columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 15 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 },
            7: { cellWidth: 20 },
            8: { cellWidth: 20 },
            9: { cellWidth: 20 }
            }
        };

        // Add the table to the document
        doc.text('Audit Report', 10, 10);
        doc.autoTable(tableHeader, tableRows, tableOptions);

        // Save and download the PDF file
        doc.save('audit_report.pdf');
        },
        error: function(error) {
        console.log(error);
        }

    })
}

let logout = document.getElementById('logoutBtn');
logout.addEventListener('click', () => {
    $.post(
        "http://127.0.0.1:3000/logout",
        {
            userMail: sessionStorage.getItem('userMail')
        },
        function (result) {
            sessionStorage.setItem('sessionVar', null);
            window.location.href = `./index.html`;
        }
    )
});