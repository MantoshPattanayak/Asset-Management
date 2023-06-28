$(document).ready(function() {
    console.log("document ready");
    load_data();
  
    function load_data() {
      console.log("Loading");
  
      $.ajax({
        url: "http://localhost:9090/audit_parent",
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
        url: "http://localhost:9090/audit_parent",
        method: "POST",
        data: {
          page_number: currentPage,
          page_size: maxRows
        },
    
        success: function(response) {
          console.log(response)
          var data = response.answer.answer;
          var message = response.answer.allPages;
          all_rows = message.total_rows;
  
          $(tableBodyElement).html(""); // Clear the table body
          console.log(data)
  
          for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var html = "<tr>";
            html += "<td>" + row.id + "</td>";
            html += "<td>" + row.location_name + "</td>";
            html += "<td>" + row.dept_name + "</td>";
            html += "<td>" + row.AuditorName + "</td>";
            html += "<td>" + row.ScheduledStartDate + "</td>";
            html += "<td>" + row.ScheduledEndDate + "</td>";
       
            html += "<td>" + row.EmployeeNo + "</td>";
            html += "<td>" + row.AuditStatus + "</td>";
            html += '<td><button class="btn-info edit-btn">Details</button></a></td>';
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