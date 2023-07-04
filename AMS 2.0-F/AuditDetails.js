//**************************************Audit Status********************************************************************************* */

let all_rows;
var lastPage = 1;
  if (sessionStorage.getItem('sessionVar') != 'pass') {
    window.location.href = `./index.html`;
  }


// Function to fetch data from the backend
// let auditID = sessionStorage.getItem('auditID');
// // Call the fetchData function when the document is ready
// $(document).ready(function() {
//     //fetchData();
//     $.ajax({
//       url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}`, // Replace 'backend_url' with the actual URL of your backend endpoint
//       type: 'GET',
//       success: function(response) {
//         // Set the values of input fields
//         console.log('doc ready function data fetch', response);
        
//       },
//       error: function() {
//         // Handle error case
//         console.log('Error fetching data from the backend.');
//       }
//     });
//   });
  

// function fetchData() {
//     // Make an AJAX request
    
//   }
  

let auditID = sessionStorage.getItem('auditID');

$(document).ready(function() {
  let page_size = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
  
  $.ajax({
    url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}&page_number=${1}&page_size=${page_size}`,
    type: 'POST',
    success: function(response) {
      console.log('doc ready function data fetch', response);

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

     // Function to display data in table
    //  function displayData(data) {
    //   let html = '';
    //   for (let i = 0; i < data.assetAuditDetailsData.length; i++) {
    //     html += `
    //       <tr>
    //         <td>${data.assetAuditDetailsData[i].tag_id}</td>
    //         <td>${data.assetAuditDetailsData[i].tag_uuid}</td>
    //         <td>${data.assetAuditDetailsData[i].asset_id}</td>
    //         <td>${data.assetAuditDetailsData[i].asset_class}</td>
    //         <td>${data.assetAuditDetailsData[i].asset_type}</td>
    //         <td>${data.assetAuditDetailsData[i].asset_name}</td>
    //         <td>${data.assetAuditDetailsData[i].location_name}</td>
    //         <td>${data.assetAuditDetailsData[i].AssetStatus}</td>
    //       </tr>`;
    //   }
    //   $('#table-1 tbody').html(html);


      var html = '';
      //console.log(data)

      all_rows = response.all_rows.allPages;   //set total number of assets

      console.log('response length on doc ready function', all_rows);

      $(".table-body").html(html);

      getPagination('.table-body', 1);

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
          url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}&page_number=${currentPage}&page_size=${maxRows}`,
          method: "POST",
          success: function(response) {
            console.log(response)
            console.log(currentPage);
            var data = response.assetAuditDetailsData;
            var message = response.all_rows.all_Pages;
            all_rows = response.all_rows.allPages;
    
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
    },
    error: function() {
      console.log('Error fetching data from the backend.');
    }
  });
});

//function to render chart
function chartRender(response){
  try {
    myChart.data.datasets[0].data = [
      (response.assetCountData[0].FoundAssetCount / response.assetCountData[0].TotalAssets) * 100,
      (response.assetCountData[0].NewAssetCount / response.assetCountData[0].TotalAssets) * 100,
      (response.assetCountData[0].MissingAssetCount / response.assetCountData[0].TotalAssets) * 100
      //response.newAssets
    ];
    console.log(myChart.data.datasets[0].data);
  } catch (error) {
    // Display "none" when there is no data
    console.log(error);
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

    


/*************************************************************************************************************************************************/
// $(document).ready(function() {
//   console.log("document ready");
//   load_data();

//   function load_data() {
//     console.log("Loading");

//     $.ajax({
//       url: "http://localhost:3000/audit-asset/fetch-data",
//       method: "POST",
//       data: { action: 'fetch' },
//       dataType: "JSON",
//       success: function(data) {
//         var html = '';
//         console.log(data)

//         console.log('data length on doc ready function', data.answer.allPages.total_rows);

//         all_rows = data.answer.allPages.total_rows;

//         $(".table-body").html(html);

//         getPagination('.table-body', 1);
//       }
//     });
//   }

//   /**   Pagination part */


//   function getPagination(table, pageNumber) {
//     console.log('table', table);

//     var tableBodyElement = $(table);
//     console.log('tableBodyElement', tableBodyElement);

//     var currentPage = pageNumber;
//     console.log("getPaging function called!!!!");

//     initializePagination(tableBodyElement);
//   }

//   function fetchTableData(currentPage, maxRows, tableBodyElement) {
//     console.log(currentPage );
//     $.ajax({
//       url: "http://localhost:3000/audit-asset/fetch-data",
//       method: "POST",
//       data: {
//         page_number: currentPage,
//         page_size: maxRows
//       },
  
//       success: function(response) {
//         console.log(response)
//         console.log(pageNumber);
//         var data = response.assetAuditDetailsData;
//         var message = response.all_rows.all_Pages;
//         all_rows = message.total_rows;

//         $(tableBodyElement).html(""); // Clear the table body
//         console.log(data)

//         for (var i = 0; i < data.length; i++) {
//           var row = data[i];
//           var html = "<tr>";
//           html += "<td>" + row.tag_id + "</td>";
//           html += "<td>" + row.tag_uuid + "</td>";
//           html += "<td>" + row.asset_id + "</td>";
//           html += "<td>" + row.asset_class + "</td>";
//           html += "<td>" + row.asset_type+ "</td>";
//           html += "<td>" + row.asset_name + "</td>";
     
//           html += "<td>" + row.location_name + "</td>";
//           html += "<td>" + row.AssetStatus + "</td>";
         
//           html += "</tr>";
//           $(tableBodyElement).append(html);
//         }

//         limitPagination();
//       },
//       error: function(error) {
//         console.error("Error fetching table data:", error);
//       }
//     });
//   }

//   function initializePagination(tableBodyElement) {
//     $('#maxRows').on('change', function(evt) {
//       lastPage = 1;
//       $('.pagination')
//         .find('li')
//         .slice(1, -1)
//         .remove();
//       var trnum = 0; // reset tr counter
//       var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);

//       if (maxRows == 500) {
//         $('.pagination').hide();
//         console.log('pagination hide!!!');
//       } else {
//         $('.pagination').show();
//         console.log('pagination show!!!');
//       }

//       $(tableBodyElement)
//         .find('tr')
//         .each(function() {
//           trnum++;
//           if (trnum > maxRows) {
//             $(this).hide();
//           }
//           if (trnum <= maxRows) {
//             $(this).show();
//           }
//         });

//       if (all_rows > maxRows) {
//         var pagenum = Math.ceil(all_rows / maxRows);
//         console.log("No of page", pagenum)
//         for (var i = 1; i <= pagenum; ) {
//           $('.pagination #prev')
//             .before(
//               '<li data-page="' +
//                 i + 
//                 '">\
//                 <span>' +
//                 i +
//                 '</span>\
//               </li>'
//             )
//             .show();
//           i++;
//         }
//       }

//       fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), tableBodyElement);

//       $('.pagination [data-page="1"]').addClass('active');
//       $('.pagination li').on('click', function(evt) {
//         evt.stopImmediatePropagation();
//         evt.preventDefault();
//         var pageNum = $(this).attr('data-page');
//         var maxRows = parseInt($('#maxRows').val());

//         if (pageNum == 'prev') {
//           if (lastPage == 1) {
//             return;
//           }
//           pageNum = --lastPage;
//         }
//         if (pageNum == 'next') {
//           if (lastPage == $('.pagination li').length - 2) {
//             return;
//           }
//           pageNum = ++lastPage;
//         }

//         lastPage = pageNum;
//         var trIndex = 0;
//         $('.pagination li').removeClass('active');
//         $('.pagination [data-page="' + lastPage + '"]').addClass('active');
//         limitPagination();

//         fetchTableData(lastPage, maxRows, tableBodyElement);
//       });
//       limitPagination();
//     })
//     .val(parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value))
//     .change();
//   }

//   function limitPagination() {
//     var currentPage = parseInt($('.pagination li.active').attr('data-page'));
//     var totalPages = $('.pagination li').length - 2;

//     if (currentPage <= 3) {
//       $('.pagination li:gt(5)').hide();
//       $('.pagination li:lt(5)').show();
//       $('.pagination [data-page="next"]').show();
//       $('.pagination [data-page="prev"]').show();
//     } else if (currentPage > 3 && currentPage < totalPages - 2) {
//       $('.pagination li').hide();
//       $('.pagination [data-page="next"]').show();
//       $('.pagination [data-page="prev"]').show();

//       for (var i = currentPage - 2; i <= currentPage + 2; i++) {
//         $('.pagination [data-page="' + i + '"]').show();
//       }
//     } else {
//       $('.pagination li').hide();
//       $('.pagination [data-page="next"]').show();
//       $('.pagination [data-page="prev"]').show();

//       for (var j = totalPages - 4; j <= totalPages; j++) {
//         $('.pagination [data-page="' + j + '"]').show();
//       }
//     }
//   }

//   $('.pagination-container').on('click', 'li[data-page]', function(evt) {
//     evt.stopImmediatePropagation();
//     evt.preventDefault();
//     var pageNum = $(this).attr('data-page');
//     var maxRows = parseInt($('#maxRows').val());

//     if (pageNum == 'prev') {
//       if (lastPage == 1) {
//         return;
//       }
//       pageNum = --lastPage;
//     }
//     if (pageNum == 'next') {
//       if (lastPage == $('.pagination li').length - 2) {
//         return;
//       }
//       pageNum = ++lastPage;
//     }

//     lastPage = pageNum;
//     var trIndex = 0;
//     $('.pagination li').removeClass('active');
//     $('.pagination [data-page="' + lastPage + '"]').addClass('active');
//     limitPagination();

//     fetchTableData(lastPage, maxRows, '.table-body');
//   });

//   $('#maxRows').on('change', function(evt) {
//     lastPage = 1;
//     $('.pagination')
//       .find('li')
//       .slice(1, -1)
//       .remove();
//     var trnum = 0; // reset tr counter
//     var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);

//     if (maxRows == 500) {
//       $('.pagination').hide();
//       console.log('pagination hide!!!');
//     } else {
//       $('.pagination').show();
//       console.log('pagination show!!!');
//     }

//     $('.table-body')
//       .find('tr')
//       .each(function() {
//         trnum++;
//         if (trnum > maxRows) {
//           $(this).hide();
//         }
//         if (trnum <= maxRows) {
//           $(this).show();
//         }
//       });

//     if (all_rows > maxRows) {
//       var pagenum = Math.ceil(all_rows / maxRows);
//       console.log("No of page", pagenum)
//       for (var i = 1; i <= pagenum; ) {
//         $('.pagination #prev')
//           .before(
//             '<li data-page="' +
//               i +
//               '">\
//               <span>' +
//               i +
//               '</span>\
//             </li>'
//           )
//           .show();
//         i++;
//       }
//     }

//     fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), '.table-body');

//     $('.pagination [data-page="1"]').addClass('active');
//     $('.pagination li').on('click', function(evt) {
//       evt.stopImmediatePropagation();
//       evt.preventDefault();
//       var pageNum = $(this).attr('data-page');
//       var maxRows = parseInt($('#maxRows').val());

//       if (pageNum == 'prev') {
//         if (lastPage == 1) {
//           return;
//         }
//         pageNum = --lastPage;
//       }
//       if (pageNum == 'next') {
//         if (lastPage == $('.pagination li').length - 2) {
//           return;
//         }
//         pageNum = ++lastPage;
//       }

//       lastPage = pageNum;
//       var trIndex = 0;
//       $('.pagination li').removeClass('active');
//       $('.pagination [data-page="' + lastPage + '"]').addClass('active');
//       limitPagination();

//       fetchTableData(lastPage, maxRows, '.table-body');
//     });
//     limitPagination();
//   });

// });

    
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

