/**alok */


$(document).ready(function() {
  if (sessionStorage.getItem('sessionVar') != 'pass') {
    window.location.href = `./index.html`;
  }


    console.log("document ready");
    load_data();
  
    function load_data() {
      console.log("Loading");
  
      $.ajax({
        url: "http://localhost:3000/audit-overview/audit_parent",
        method: "POST",
        data: { action: 'fetch' },
        dataType: "JSON",
        success: function(data) {
          var html = '';
          console.log(data)
  
          console.log('data length on doc ready function', data.answer.allPages.total_rows);
  
          all_rows = data.answer.allPages.total_rows;
  
          $(".table-body").html(html);
  
          getPagination('.table-body', 1);
        }
      });
    }
  
    /**   Pagination part */
    let all_rows;
    var lastPage = 1;
  
    function getPagination(table, pageNumber) {
      console.log('table', table);
  
      var tableBodyElement = $(table);
      console.log('tableBodyElement', tableBodyElement);
  
      var currentPage = pageNumber;
      console.log("getPaging function called!!!!");
  
      initializePagination(tableBodyElement);
    }
  
    function fetchTableData(currentPage, maxRows, tableBodyElement) {
      console.log(currentPage );
      $.ajax({
        url: "http://localhost:3000/audit-overview/audit_parent",
        method: "POST",
        data: {
          page_number: currentPage,
          page_size: maxRows
        },
      
        success: function(response) {
          console.log(response);
          var data = response.answer.answer;
          var message = response.answer.allPages;
          all_rows = message.total_rows;
      
          $(tableBodyElement).html(""); // Clear the table body
          console.log(data);
      
          for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var html = "<tr>";
            html += "<td>" + row.id + "</td>";
            html += "<td>" + row.location_name + "</td>";
            html += "<td>" + row.dept_name + "</td>";
            html += "<td>" + row.AuditorName + "</td>";
            
            // Convert UTC to IST for ScheduledStartDate
            var startDate = new Date(row.ScheduledStartDate);
            var istStartDate = startDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            html += "<td>" + istStartDate + "</td>";
            
            // Convert UTC to IST for ScheduledEndDate
            var endDate = new Date(row.ScheduledEndDate);
            var istEndDate = endDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            html += "<td>" + istEndDate + "</td>";
            
            html += "<td>" + row.EmployeeNo + "</td>";
            html += "<td>" + row.AuditStatus + "</td>";
            html += `<td><button class="btn-info edit-btn" onclick="sessionStorage.setItem('auditID', ${row.id}); window.location.href='AuditDetails.html';">Details</button></a></td>`;
            html += "</tr>";
            $(tableBodyElement).append(html);
          }

          limitPagination();
        },
        error: function(error) {
          console.error("Error fetching table data:", error);
        }
      });
      
    }
  
    function initializePagination(tableBodyElement) {
      $('#maxRows').on('change', function(evt) {
        lastPage = 1;
        $('.pagination')
          .find('li')
          .slice(1, -1)
          .remove();
        var trnum = 0; // reset tr counter
        var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
  
        if (maxRows == 500) {
          $('.pagination').hide();
          console.log('pagination hide!!!');
        } else {
          $('.pagination').show();
          console.log('pagination show!!!');
        }
  
        $(tableBodyElement)
          .find('tr')
          .each(function() {
            trnum++;
            if (trnum > maxRows) {
              $(this).hide();
            }
            if (trnum <= maxRows) {
              $(this).show();
            }
          });
  
        if (all_rows > maxRows) {
          var pagenum = Math.ceil(all_rows / maxRows);
          console.log("No of page", pagenum)
          for (var i = 1; i <= pagenum; ) {
            $('.pagination #prev')
              .before(
                '<li data-page="' +
                  i + 
                  '">\
                  <span>' +
                  i +
                  '</span>\
                </li>'
              )
              .show();
            i++;
          }
        }
  
        fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), tableBodyElement);
  
        $('.pagination [data-page="1"]').addClass('active');
        $('.pagination li').on('click', function(evt) {
          evt.stopImmediatePropagation();
          evt.preventDefault();
          var pageNum = $(this).attr('data-page');
          var maxRows = parseInt($('#maxRows').val());
  
          if (pageNum == 'prev') {
            if (lastPage == 1) {
              return;
            }
            pageNum = --lastPage;
          }
          if (pageNum == 'next') {
            if (lastPage == $('.pagination li').length - 2) {
              return;
            }
            pageNum = ++lastPage;
          }
  
          lastPage = pageNum;
          var trIndex = 0;
          $('.pagination li').removeClass('active');
          $('.pagination [data-page="' + lastPage + '"]').addClass('active');
          limitPagination();
  
          fetchTableData(lastPage, maxRows, tableBodyElement);
        });
        limitPagination();
      })
      .val(parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value))
      .change();
    }
  
    function limitPagination() {
      var currentPage = parseInt($('.pagination li.active').attr('data-page'));
      var totalPages = $('.pagination li').length - 2;
  
      if (currentPage <= 3) {
        $('.pagination li:gt(5)').hide();
        $('.pagination li:lt(5)').show();
        $('.pagination [data-page="next"]').show();
        $('.pagination [data-page="prev"]').show();
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        $('.pagination li').hide();
        $('.pagination [data-page="next"]').show();
        $('.pagination [data-page="prev"]').show();
  
        for (var i = currentPage - 2; i <= currentPage + 2; i++) {
          $('.pagination [data-page="' + i + '"]').show();
        }
      } else {
        $('.pagination li').hide();
        $('.pagination [data-page="next"]').show();
        $('.pagination [data-page="prev"]').show();
  
        for (var j = totalPages - 4; j <= totalPages; j++) {
          $('.pagination [data-page="' + j + '"]').show();
        }
      }
    }
  
    $('.pagination-container').on('click', 'li[data-page]', function(evt) {
      evt.stopImmediatePropagation();
      evt.preventDefault();
      var pageNum = $(this).attr('data-page');
      var maxRows = parseInt($('#maxRows').val());
  
      if (pageNum == 'prev') {
        if (lastPage == 1) {
          return;
        }
        pageNum = --lastPage;
      }
      if (pageNum == 'next') {
        if (lastPage == $('.pagination li').length - 2) {
          return;
        }
        pageNum = ++lastPage;
      }
  
      lastPage = pageNum;
      var trIndex = 0;
      $('.pagination li').removeClass('active');
      $('.pagination [data-page="' + lastPage + '"]').addClass('active');
      limitPagination();
  
      fetchTableData(lastPage, maxRows, '.table-body');
    });
  
    $('#maxRows').on('change', function(evt) {
      lastPage = 1;
      $('.pagination')
        .find('li')
        .slice(1, -1)
        .remove();
      var trnum = 0; // reset tr counter
      var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
  
      if (maxRows == 500) {
        $('.pagination').hide();
        console.log('pagination hide!!!');
      } else {
        $('.pagination').show();
        console.log('pagination show!!!');
      }
  
      $('.table-body')
        .find('tr')
        .each(function() {
          trnum++;
          if (trnum > maxRows) {
            $(this).hide();
          }
          if (trnum <= maxRows) {
            $(this).show();
          }
        });
  
      if (all_rows > maxRows) {
        var pagenum = Math.ceil(all_rows / maxRows);
        console.log("No of page", pagenum)
        for (var i = 1; i <= pagenum; ) {
          $('.pagination #prev')
            .before(
              '<li data-page="' +
                i +
                '">\
                <span>' +
                i +
                '</span>\
              </li>'
            )
            .show();
          i++;
        }
      }
  
      fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), '.table-body');
  
      $('.pagination [data-page="1"]').addClass('active');
      $('.pagination li').on('click', function(evt) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
        var pageNum = $(this).attr('data-page');
        var maxRows = parseInt($('#maxRows').val());
  
        if (pageNum == 'prev') {
          if (lastPage == 1) {
            return;
          }
          pageNum = --lastPage;
        }
        if (pageNum == 'next') {
          if (lastPage == $('.pagination li').length - 2) {
            return;
          }
          pageNum = ++lastPage;
        }
  
        lastPage = pageNum;
        var trIndex = 0;
        $('.pagination li').removeClass('active');
        $('.pagination [data-page="' + lastPage + '"]').addClass('active');
        limitPagination();
  
        fetchTableData(lastPage, maxRows, '.table-body');
      });
      limitPagination();
    });
  });





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
          console.log(data);
          var totalCount = 0;
          
          // Calculate the total count
          for(var i = 0; i < data.recordset.length; i++) {
            totalCount += data.recordset[i].count;
            if(data.recordset[i].AuditStatus=='Closed'){
              var a=data.recordset[i].count;
            }
            if(data.recordset[i].AuditStatus=='Inprogress'){
              var b=data.recordset[i].count;
            }
            if(data.recordset[i].AuditStatus=='Open'){
              var c=data.recordset[i].count;
            }
            if(data.recordset[i].AuditStatus=='Expired'){
              var d=data.recordset[i].count;
            }
          }
          console.log(a,b,c,d);
          
          // Update the chart for each recordset
          updateChart('new-audit', c, totalCount);
          updateChart('inprogress-audit', b, totalCount);
          updateChart('closed-audit', a, totalCount);
          updateChart('expired-audit',d, totalCount);
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



  function fetchOptions() {
    $.ajax({
        url: 'http://localhost:3000/locations',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let locationSelect = response.recordset.map((n) => {
                $('#LocationId')[0].appendChild(new Option(n.location_name, n.location_id, false, false))
            });
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });

    $.ajax({
        url: 'http://localhost:3000/departments',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            response.recordset.map((n) => {
                $('#DepartmentId')[0].appendChild(new Option(n.dept_name, n.dept_id, false, false))
            });

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
  }
fetchOptions();


// Function to perform the AJAX request and fetch data
function fetchData() {
  // Get the parameter values from the input fields
  var LocationId = $('#LocationId').val();
  var DepartmentId = $('#DepartmentId').val();
  var EmployeeNo = $('#EmployeeNo').val();

  // Construct the URL with the parameter values
  var url = 'http://localhost:3000/advanceSearchForAudit?';

  if (LocationId) {
    url += 'LocationId=' + LocationId;
  }


  if (DepartmentId) {
    if (LocationId) {
      url += '&';
    }
    url += 'DepartmentId=' + DepartmentId;
  }

  if (EmployeeNo) {
    if (LocationId || DepartmentId) {
      url += '&';
    }
    url += 'EmployeeNo=' + EmployeeNo;
  }

  // Perform the AJAX request
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response && response.recordset.length > 0) {
        // Creating the table rows
        var tableBody = $('#audit-table-body');
        tableBody.empty(); // Clear any existing rows

        for (var i = 0; i < response.recordset.length; i++) {
          var rowData = response.recordset[i];
          var dataRow = $('<tr>');
          dataRow.append('<td>' + rowData.Id + '</td>');
          dataRow.append('<td>' + rowData.location_name + '</td>');
          dataRow.append('<td>' + rowData.dept_name + '</td>');
          dataRow.append('<td>' + rowData.AuditorName + '</td>');
          dataRow.append('<td>' + rowData.StartDate + '</td>');          
          dataRow.append('<td>' + rowData.EndDate + '</td>');
          dataRow.append('<td>' + rowData.EmployeeNo + '</td>');
          dataRow.append('<td>' + rowData.AuditStatus + '</td>');
          dataRow.append('<td>' + '<button class="btn-info edit-btn">Details</button></a>' + '</td>');

          tableBody.append(dataRow);
        }

        // Convert UTC to IST for ScheduledStartDate
        // var startDate = new Date(row.StartDate);
        // var StartDate = startDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        //  + "<td>" + StartDate + "</td>";
        
        // // Convert UTC to IST for ScheduledEndDate
        // var endDate = new Date(rowData.EndDate);
        // var EndDate = endDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        // + "<td>" + EndDate + "</td>";

        // Show the table section and hide the no-data message
        $('.table-scroll').show();
        $('#no-data-message').hide();
      } else {
        // Hide the table section and show the no-data message
        $('.table-scroll').hide();
        $('#no-data-message').show();
      }
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
}

// Bind the click event of the search button
$('#searchButton').click(function() {
  // Call the fetchData function to perform the search
  fetchData();
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
