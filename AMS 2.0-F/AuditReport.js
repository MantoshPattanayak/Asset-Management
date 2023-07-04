
$(document).ready(function(){
    $('#audit-submit').on('click', function(event) {
        event.preventDefault(); // Prevent form submission
    
        let employeeNumber = $('#fieldName').val();
        let fromDate = $('#startDate').val();
        let toDate = $('#endDate').val();
    
    
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
