//**************************************Audit Status********************************************************************************* */

let all_rows;
var lastPage = 1;

let auditID = sessionStorage.getItem('auditID');
/**==============================================DOCUMENT READY FUNCTION - START================================================= */
$(document).ready(function() {

  //if no user role in session, then redirect to login page
  if (sessionStorage.getItem('sessionVar') != 'pass' && sessionStorage.getItem('sessionVar') != 'userPass') {
    window.location.href = `./index.html`;
  }

  let page_size = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);

  /**=====================================AJAX CALL to check loggedin user role - START===================================
   * if user role, then display dashbord, audit and profile section in side navbar
   * else display all sections for admin
   * */
  $.ajax({
    url: "http://localhost:3000/audit-overview/audit_roll_check?employeeID="+sessionStorage.getItem('userID'),
    method: "GET",
    data: {
    },

    dataType: "",
    success: function(user_type) {
      // console.log(user_type)
      if (user_type == "user"){
        //$('#create_audit').hide();
        $('#button-div-audit').html('');
        $('#button-div-audit').html(`<a href="AuditReport.html">
                                          <button class="onclick-btn">
                                            Audit Report
                                          </button>
                                      </a>`);
        $('#side-nav-bar').html('');
        $('#side-nav-bar').html(`
            <ul>
              <li>
                  <!-- Dashboard -->
                  <a href="./userDash.html"><i class='bx bxs-dashboard'></i></a>
              </li>
              <li>
                  <!-- Profile -->
                  <a href="./AuditOverview.html"><i class='bx bx-edit'></i></a>
              </li>
              <li>
                  <!-- Profile -->
                  <a href="./profile.html"><i class='bx bxs-user'></i></a>
              </li>

          </ul>
        `);
      };
    },
    error: function(error) {
      console.error("Error fetching table data:", error);
    },
    // complete: function() {
    //   // Disable the button
    //   if (user)
    //     {$('#create_audit').hide()};
    // }
  });
  /**=====================================AJAX CALL to check loggedin user role - END===================================*/
  
  /**AJAX Call to fetch audit details and display in form section and chart section -  START*/
  $.ajax({
    url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}&page_number=${1}&page_size=${page_size}`,
    type: 'POST',
    success: function(response) {
      // console.log('doc ready function data fetch', response);

      // Update the input fields with the fetched data
      $('#aduit-scope-input-no').val(response.auditNumber);
      $('#aduit-scope-input-name').val(response.auditorName);
      $('#aduit-scope-input-status').val(response.auditStatus);
      $('#aduit-scope-input-location').val(response.locationName);
      $('#aduit-scope-input-start-date').val(formatDate(response.scheduledStartDate));
      $('#aduit-scope-input-end-date').val(formatDate(response.scheduledEndDate));
      $('#scanned-expected').val(response.assetCountData[0].FoundAssetCount);
      $('#scanned-not-expected').val(response.assetCountData[0].NewAssetCount);
      $('#expected-not-found').val(response.assetCountData[0].MissingAssetCount);
      // $('#new').val(response.assetCountData.NewAssetCount);
 
      
     chartRender(response);  //display chart


      var html = '';
      //console.log(data)

      all_rows = response.all_rows.all_pages;   //set total number of assets

      // console.log('response length on doc ready function', all_rows);

      $(".table-body").html(html);

      getPagination('.table-body', 1);

      function getPagination(table, pageNumber) {
        // console.log('table', table);
    
        var tableBodyElement = $(table);
        // console.log('tableBodyElement', tableBodyElement);
    
        var currentPage = pageNumber;
        // console.log("getPaging function called!!!!");
    
        initializePagination(tableBodyElement);
      }
    
      function fetchTableData(currentPage, maxRows, tableBodyElement) {
        // console.log(currentPage );
        $.ajax({
          url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}&page_number=${currentPage}&page_size=${maxRows}`,
          method: "POST",
          success: function(response) {
            // console.log(response)
            // console.log(currentPage);
            var data = response.assetAuditDetailsData;
            var message = response.all_rows.all_Pages;
            all_rows = response.all_rows.all_pages;
    
            $(tableBodyElement).html(""); // Clear the table body
    
            for (var i = 0; i < data.length; i++) {
              var row = data[i];
              var html = "<tr>";
              html += "<td>" + row.tag_id + "</td>";
              html += "<td>" + row.tag_uuid + "</td>";
              html += "<td>" + row.asset_id + "</td>";
              html += "<td>" + row.asset_class + "</td>";
              html += "<td>" + row.asset_type+ "</td>";
              html += "<td>" + row.asset_name + "</td>";
         
              html += "<td>" + row.location_name + "</td>";
              html += "<td>" + row.AssetStatus + "</td>";
             
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
            // console.log('pagination hide!!!');
          } else {
            $('.pagination').show();
            // console.log('pagination show!!!');
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
            // console.log("No of page", pagenum)
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
          // console.log('pagination hide!!!');
        } else {
          $('.pagination').show();
          // console.log('pagination show!!!');
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
          // console.log("No of page", pagenum)
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
        else{
          // console.log('all_rows < maxRows', all_rows, maxRows);
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
    },
    error: function() {
      // console.log('Error fetching data from the backend.');
    }
  });
  /**AJAX Call to fetch audit details and display in form section and chart section -  END*/
});
/**==============================================DOCUMENT READY FUNCTION - END================================================= */


//function to render chart
/**display number of assets which is found, missing and new in a specific location, department in a piechart*/
function chartRender(response){
  try {
    myChart.data.datasets[0].data = [
      (response.assetCountData[0].FoundAssetCount / response.assetCountData[0].TotalAssets) * 100,
      (response.assetCountData[0].NewAssetCount / response.assetCountData[0].TotalAssets) * 100,
      (response.assetCountData[0].MissingAssetCount / response.assetCountData[0].TotalAssets) * 100
      //response.newAssets
    ];
    // console.log(myChart.data.datasets[0].data);
  } catch (error) {
    // Display "none" when there is no data
    // console.log(error);
  }
  

  // Update the pie chart labels
  myChart.data.labels = [
    "Scanned and Expected",
    "Scanned and Not Expected",
    "Expected and Not Found"
  ];

  // Update the pie chart colors (if desired)
  myChart.data.datasets[0].backgroundColor = [
    "#2ecc71",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c"
  ];

  // Update the pie chart
  myChart.update();
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

/**log out functionality */
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

