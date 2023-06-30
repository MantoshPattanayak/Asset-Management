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
