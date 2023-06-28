$(document).ready(function () {
    if (sessionStorage.getItem('sessionVar') != 'pass') {
        window.location.href = `./index.html`;
    }
})

//Soumyak's code start
// 4 piechart details


    fetchChartData(); // Fetch initial chart data
    setInterval(fetchChartData, 10000); // Update chart data every 10 seconds
  
    function fetchChartData() {
      $.ajax({
        url: 'http://localhost:3000/progressbarForAudit',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          var totalCount = 0;
          
          // Calculate the total count
          for(var i = 0; i < data.recordset.length; i++) {
            totalCount += data.recordset[i].count;
          }
          
          // Update the chart for each recordset
          updateChart('new-audit', data.recordset[2].count, totalCount);
          updateChart('inprogress-audit', data.recordset[1].count, totalCount);
          updateChart('closed-audit', data.recordset[0].count, totalCount);
          // updateChart('expired-audit',data.recordset[3].count, totalCount);
        },
        error: function() {
          console.log('Error occurred while fetching chart data.');
        }
      });
    }
    
    function updateChart(chartId, value, totalCount) {
      const chartElement = $('#' + chartId + ' .pie-chart');
      var percentage = (value / totalCount) * 100;
      chartElement.css('--p', percentage);
      chartElement.text(percentage.toFixed(2));
    }
    
  

//   function updateChart(chartId, value) {
//     const chartElement = $('#' + chartId + ' .pie-chart');
//     chartElement.css('--p', value);
//     chartElement.text(value);
//   }
  

//   {
//     "newAudit": 74.32,
//     "inprogressAudit": 59.44,
//     "closedAudit": 31.95,
//     "expiredAudit": 31.95
//   }
  // Soumyak's code end-----



// Using Ajax to fetch data from the Node.js API
$.ajax({
    url: 'http://localhost:3000/advanceSearchForAudit',
    
    type: 'GET',
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