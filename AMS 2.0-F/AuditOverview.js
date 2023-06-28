$(document).ready(function () {
    if (sessionStorage.getItem('sessionVar') != 'pass') {
        window.location.href = `./index.html`;
    }
})


// Using Ajax to fetch data from the Node.js API
$.ajax({
    url: 'http://localhost:3000/advanceSearchForAudit',
    type: 'POST',
    dataType: 'json',
    success: function (response) {
        // Assuming the response is an array of objects
        if (response && response.length > 0) {
            // Creating the table header
            console.log(response);

        //     var table = $('<table>');
        //     var headerRow = $('<tr>');
        //     headerRow.append('<th>LocationId</th>');
        //     headerRow.append('<th>DepartmentId</th>');
        //     headerRow.append('<th>EmployeeNo</th>');
        //     table.append(headerRow);

        //     // Populating the table with data
        //     for (var i = 0; i < response.length; i++) {
        //         var rowData = response[i];
        //         var dataRow = $('<tr>');
        //         dataRow.append('<td>' + rowData.LocationId + '</td>');
        //         dataRow.append('<td>' + rowData.DepartmentId + '</td>');
        //         dataRow.append('<td>' + rowData.EmployeeNo + '</td>');
        //         table.append(dataRow);
        //     }

        //     // Adding the table to the HTML page
        //     $('#tableContainer').empty().append(table);
        }
        //  else {
        //     $('#tableContainer').text('No data found.');
        // }
    },
    error: function (xhr, status, error) {
        console.error('Error:', error);
    }
});










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