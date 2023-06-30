let locationDetails = [];
let departmentDetails = [];
let locationDepartment = [];
let all_rows = 0;


/*************************************DOCUMENT READY FUNCTION -  START************************************************************/
$(document).ready(function(){
    //ajax call to fetch location and department details on window load
    console.log("audit assign page");

  $.ajax({
      url: "http://localhost:3000/audit-assign/loc-dept-fetch",
      method: "GET",
      success: function (response) {

        console.log(response);

        locationDetails = response.location;
        departmentDetails = response.department;
        locationDepartment = response.loc_dep;
        console.log('location details', locationDetails);
        console.log("doc ready func", locationDepartment);
        console.log('doc ready func dept details', departmentDetails);
      
        // setting options for location dropdown
        let locationSelectElement = document.getElementById('location-select');

        locationDetails.forEach((location)=> {
          var opt = document.createElement('option');
          opt.value = location.location_id;
          opt.innerHTML = location.location_name;
          locationSelectElement.appendChild(opt);
        })
      },
      error: function(error) {
        console.error("Error fetching table data:", error);
      }
  });

  //  trigger function to fetch expected assets based on input in two dropdown fields: - location name and department name
  let locationSelectElement = document.getElementById('location-select');
  let departmentSelectElement = document.getElementById('department-select');

  locationSelectElement.addEventListener('input', fetchExpectedAssets);
  departmentSelectElement.addEventListener('input', fetchExpectedAssets);

  function fetchExpectedAssets(e){
    e.preventDefault();
    let selectedLocationId = locationSelectElement.value;
    let selectDepartmentId = departmentSelectElement.value;
    console.log('doc ready fetchExpectedAssets func', selectedLocationId, selectDepartmentId);
    let page_size = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
    let page_number = 1;

    if(selectedLocationId && selectDepartmentId){
      $.ajax({
        url:"http://localhost:3000/audit-assign/audit-assign-one",
        data: {
          location_id: selectedLocationId,
          dept_id: selectDepartmentId,
          page_size: page_size,
          page_number: page_number
        },
        type: "GET",
            success: function (response) {
            console.log(response);
            
            all_rows = response.answer.allPages.total_rows;

            if(all_rows > 0){
              let html = '';
              $(".table-body").html(html);
              getPagination('.table-body', 1);
            }
            else{
              $('#no-data-message').attr("css", { display: "block" });
            }
            
          },
          error: function(error) {
            console.error("Error fetching data:", error);
          }
      })
    }
  }
  //=================================to change url to fetch data for expected assets================================================//
  function getPagination(tableBodyElement, pageNumber){
    console.log('table', tableBodyElement);

    var tableBodyElement = $(tableBodyElement);
    console.log('tableBodyElement', tableBodyElement);

    let currentPage = pageNumber;
    console.log("getPaging function called!!!!");

    initializePagination(tableBodyElement);
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
      console.log("maxRows", maxRows);
      if (maxRows == 500) {
        $('.pagination').hide();
        console.log('pagination hide!!!');
      } else {
        $('.pagination').show();
        console.log('pagination show!!!');
      }

      console.log("initializePagination func Total row", all_rows);
    
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
          
      fetchTableData(1, parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value), tableBodyElement); // Fetch initial table data for the first page and page size of 50
    
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
        limitPagging();
    
        fetchTableData(lastPage, maxRows, tableBodyElement);
      });
      limitPagging();
    })
    .val(parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value))
    // .val(50)
    .change();
  }

  function limitPagging() {
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

  function fetchTableData(currentPage, maxRows, tableBodyElement) {
    //var apiUrl = ;
    // Send a request  to the API to fetch the data for the specified page and page size
    let locationSelectElement = document.getElementById('location-select');
    let departmentSelectElement = document.getElementById('department-select');

    let selectedLocationId = locationSelectElement.value;
    let selectDepartmentId = departmentSelectElement.value;

    console.log('selectedLocationId', selectedLocationId);
    console.log('selectDepartmentId', selectDepartmentId);

    if(selectedLocationId && selectDepartmentId){
      $.ajax({
        url:"http://localhost:3000/audit-assign/audit-assign-one",
        type: "GET",
        data: {
          location_id: selectedLocationId,
          dept_id: selectDepartmentId,
          page_size: maxRows,
          page_number: currentPage
        },
        success: function(response) {
          var data = response.answer.answer; // Assuming the API response contains the data in the 'data' property
          // var message=response.answer.allPages  // total number of page 
          console.log("response pagination", response);
      
          console.log('total rows: ', response.answer.allPages);
          all_rows=response.answer.allPages.total_rows;
          console.log(all_rows);

          // Update the table with the fetched data
          
          $(tableBodyElement).html(""); // Clear the table body
      
          for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var html = "<tr>";
            html += "<td>" + row.asset_id + "</td>";
            html += "<td>" + row.tag_id + "</td>";
            html += "<td>" + row.tag_uuid + "</td>";
            html += "<td>" + row.asset_name + "</td>";
            html += "<td>" + row.asset_type + "</td>";
            html += "<td>" + row.location_name + "</td></tr>";
            html += "</tr>";
            $(tableBodyElement).append(html);
          }
        },
        error: function(error) {
          console.error("Error fetching table data:", error);
        }
      });
    }
  }

  $('.pagination-container').on('click', 'li[data-page]', function(evt) {
    evt.stopImmediatePropagation();
    evt.preventDefault();
    var pageNum = $(this).attr('data-page');
    var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
    
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
    limitPagging();
    
    fetchTableData(lastPage, maxRows, tableBodyElement);
  })

  $('#maxRows').on('change', initializePagination('.table-body'));
})
/*************************************DOCUMENT READY FUNCTION -  END************************************************************/

//Audit Assign fetch Employee name on Employee ID input
function fetchEmployeeDetails(event){
    event.preventDefault();
    let employeeNumber = event.target.value;

    console.log(employeeNumber);

    if(employeeNumber.length == 6){
        $.ajax({
          url: `http://localhost:3000/audit-assign/emp-no-emp-name?emp_no=${employeeNumber}`,
          method: "GET",
          success: function (response) {
            console.log(response);

            let auditorNameInputElement = document.getElementById('auditor-name');

            auditorNameInputElement.value = response.answer.emp_name;
          },
          error: function(error) {
            console.error("Error fetching data:", error);
            alert(error.responseJSON.message);
          }
        })
    }
    else{
      let auditorNameInputElement = document.getElementById('auditor-name');
      auditorNameInputElement.value = "";
    }
}

function filterDeptOptionList(event){
  event.preventDefault();
  let selectedLocationId = event.target.value;
  console.log("filterDeptOptionList func");

  console.log("selected location id", selectedLocationId);

  console.log("location dept mapping array", locationDepartment);

  let filteredDeptIDList = locationDepartment.filter((loc_dept)=>{
    return loc_dept.location_id == selectedLocationId
  })

  //setting options for department dropdown
  let departmentSelectElement = document.getElementById('department-select');

  //clear option List and initialize
  departmentSelectElement.innerHTML = '';
  let opt = document.createElement('option');
  opt.value = '';
  opt.innerHTML = "Select Department";
  departmentSelectElement.appendChild(opt);

  filteredDeptIDList.forEach((department)=> {
    let opt = document.createElement('option');
    opt.value = department.dept_id;

    let deptArrayOject = departmentDetails.filter((dept)=>{
      return dept.dept_id == department.dept_id;
    });

    opt.innerHTML = deptArrayOject[0].dept_name;
    departmentSelectElement.appendChild(opt);
  })
}

function submitForm() {
  // Perform the submit action here
  let employeeNumber = document.getElementById('employee-number').value;
  let auditorName = document.getElementById('auditor-name').value;
  let locationID = document.getElementById('location-select').value;
  let departmentID = document.getElementById('department-select').value;
  let scheduledStartDate = document.getElementById('scheduledStartDate').value;
  let scheduledEndDate = document.getElementById('scheduledEndDate').value;

  console.log('submit Form inputs: ',employeeNumber, auditorName, locationID, departmentID, scheduledStartDate, scheduledEndDate)

  let nullList = new Array();
  if(employeeNumber == '')  nullList.push('Employee No');
  if(auditorName == '')  nullList.push('Auditor Name');
  if(locationID == '')  nullList.push('Location Name');
  if(departmentID == '')  nullList.push('Department Name');
  if(scheduledStartDate.length == 0)  nullList.push('Start Date');
  if(scheduledEndDate.length == 0)  nullList.push('End Date');

  if(nullList.length == 0){
    let formData = {
      'employeeNumber': employeeNumber,
      'auditorName': auditorName,
      'locationID': locationID,
      'departmentID': departmentID,
      'scheduledStartDate': new Date(scheduledStartDate).toISOString(),
      'scheduledEndDate': new Date(scheduledEndDate).toISOString()
    }
    console.log('audit assign submiti form data', JSON.stringify(formData));
  
    //submit ajax call to submit audit assign form data
    $.ajax({
      url: "http://localhost:3000/audit-assign/submitForm",
      type: 'POST',
      data: formData,
      success: function (response){
        console.log(response);
        window.location.href = 'audit-assign.html'; //clear form
        alert("Form submitted successfully!");
        closeConfirmation();
      },
      error: function(error){
        console.error(error);
      }
    })
  }
  else{
    let formData = {
      'employeeNumber': employeeNumber,
      'auditorName': auditorName,
      'locationID': locationID,
      'departmentID': departmentID,
      'scheduledStartDate': scheduledStartDate,
      'scheduledEndDate': scheduledEndDate
    }
    console.log(JSON.stringify(formData));
    alert('Following fields are empty: - ' + nullList.toString());
  }
}