let locationDetails = [];
let departmentDetails = [];
let locationDepartment = [];
let all_rows = 0;


/*************************************DOCUMENT READY FUNCTION -  START************************************************************/
$(document).ready(function(){
  
  //if logged-in use has Admin role, then the page is accessible
  if (sessionStorage.getItem('sessionVar') != 'pass') {
    window.location.href = `./index.html`;
  }
  

  /*******function to return current date in "dd-MM-YYYY HH:mm" format - START***********************************/
  function todayDate(){
    let dtToday = new Date();
    
    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let year = dtToday.getFullYear();
    let hour = dtToday.getHours();
    let minute = dtToday.getMinutes();

    if(hour.length < 2)
      hour = '0' + hour.toString();
    if(minute.length < 2)
      minute = '0' + minute.toString();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    let todayDate = day + '-' + month + '-' + year + ' ' + hour + ':' + minute;

    return todayDate;
  }
  /*******function to return current date in "dd-MM-YYYY HH:mm" format - END***********************************/

  //to restrict past date selection in date-picker for Scheduled Start Date and End Date
  $('#scheduledStartDate').attr('min', new Date().toISOString().slice(0, 16));
  $('#scheduledEndDate').attr('min', new Date().toISOString().slice(0, 16));

  /**AJAX Call to fetch user role and display section in side navbar - START ************************************
   * if role is user, then display dashboard, audit and profile section
   * else if admin, then display all sections
   */
  $.ajax({
    url: "http://localhost:3000/audit-overview/audit_roll_check?employeeID="+sessionStorage.getItem('userID'),
    method: "GET",
    data: {
    },

    dataType: "",
    success: function(user_type) {
      //console.log(user_type)
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
  /**AJAX Call to fetch user role and display section in side navbar - END ************************************/

  /**Log out user - START */
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
  /**Log out user - END */

  /******************ajax call to fetch location and department details on window load -  START*****************/
  $.ajax({
      url: "http://localhost:3000/audit-assign/loc-dept-fetch",
      method: "GET",
      success: function (response) {

        //console.log(response);

        locationDetails = response.location;
        departmentDetails = response.department;
        locationDepartment = response.loc_dep;
        // console.log('location details', locationDetails);
        // console.log("doc ready func", locationDepartment);
        // console.log('doc ready func dept details', departmentDetails);
      
        // setting options for location dropdown
        let locationSelectElement = document.getElementById('location-select');

        locationDetails.forEach((location)=> {
          var opt = document.createElement('option');
          opt.value = location.location_id;
          opt.innerHTML = location.location_name;
          locationSelectElement.appendChild(opt);
        })

        //disable options:- outside_repair and outside_transport
        $('#location-select').find('option[value=\"923013\"]').attr('disabled', 'true');
        $('#location-select').find('option[value=\"994013\"]').attr('disabled', 'true');

      },
      error: function(error) {
        console.error("Error fetching table data:", error);
      }
  });
  /******************ajax call to fetch location and department details on window load -  END******************/

  //  trigger function to fetch expected assets based on input in two dropdown fields: - location name and department name - START**********************
  let locationSelectElement = document.getElementById('location-select');
  let departmentSelectElement = document.getElementById('department-select');

  locationSelectElement.addEventListener('input', fetchExpectedAssets);
  departmentSelectElement.addEventListener('input', fetchExpectedAssets);

  function fetchExpectedAssets(e){
    e.preventDefault();
    let selectedLocationId = locationSelectElement.value;
    let selectDepartmentId = departmentSelectElement.value;
    // console.log('doc ready fetchExpectedAssets func', selectedLocationId, selectDepartmentId);
    let page_size = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
    let page_number = 1;
    let paginationInitialElement = $('.pagination-container nav ul')[0];

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
            // console.log(response);
            
            all_rows = response.answer.allPages.total_rows;
            // console.log("all_row",all_rows);

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
    else{
        let html = '';
        $(".table-body").html(html);
        getPagination('.table-body', 1);
    }
  }
  //  trigger function to fetch expected assets based on input in two dropdown fields: - location name and department name - END***********************


  /**========================================PAGINATION Function - START==================================================== */
  /**Pagination function start */
  function getPagination(tableBodyElement, pageNumber){
    // console.log('table', tableBodyElement);

    var tableBodyElement = $(tableBodyElement);
    // console.log('tableBodyElement', tableBodyElement);

    let currentPage = pageNumber;
    // console.log("getPaging function called!!!!");

    initializePagination(tableBodyElement);
  }

  /**initialize pagination
   * create pagination bar at the bottom of the table
   */
  function initializePagination(tableBodyElement) {
    $('#maxRows').on('change', function(evt) {
      lastPage = 1;
      $('.pagination')
        .find('li')
        .slice(1, -1)
        .remove();
      var trnum = 0; // reset tr counter
      var maxRows = parseInt($('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value);
      // console.log("maxRows", maxRows);
      if (maxRows == 500) {
        $('.pagination').hide();
        // console.log('pagination hide!!!');
      } else {
        $('.pagination').show();
        // console.log('pagination show!!!');
      }

      // console.log("initializePagination func Total row", all_rows);
    
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
      else{
        // console.log('all_rows < maxRows', all_rows, maxRows);
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

  /**display page number in pagination bar on clicking next/previous button */
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

  /**Fetch pagewise data after clicking on the page number */
  function fetchTableData(currentPage, maxRows, tableBodyElement) {
    //var apiUrl = ;
    // Send a request  to the API to fetch the data for the specified page and page size
    let locationSelectElement = document.getElementById('location-select');
    let departmentSelectElement = document.getElementById('department-select');

    let selectedLocationId = locationSelectElement.value;
    let selectDepartmentId = departmentSelectElement.value;

    // console.log('selectedLocationId', selectedLocationId);
    // console.log('selectDepartmentId', selectDepartmentId);

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
          // console.log(data)
          // console.log("response pagination", response);
      
          // console.log('total rows: ', response.answer.allPages.total_rows);
          all_rows=response.answer.allPages.total_rows;
          // console.log(all_rows);

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

  /**on clicking page number initiate data fetch call */
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
/**========================================PAGINATION Function - END==================================================== */

/*************************************DOCUMENT READY FUNCTION -  END************************************************************/

/**function to restrict to only number input */
function allowOnlyDigits(event) {
  const key = event.keyCode || event.which;
  const keyChar = String.fromCharCode(key);
  const regex = /[0-9]/;

  // Allow only digits and limit input to a maximum of 6 characters
  if (!regex.test(keyChar) || event.target.value.length >= 6) {
    event.preventDefault();
    return false;
  }
}



//Audit Assign fetch Employee name on Employee ID input - START
function fetchEmployeeDetails(event) {
    event.preventDefault();
    let employeeNumber = event.target.value;
  
    console.log(employeeNumber);
  
    let errorMessageElement = document.getElementById('error-message');
    let auditorNameInputElement = document.getElementById('auditor-name');
  
    if (employeeNumber.length === 6) {
      errorMessageElement.textContent = ""; // Clear any previous error message
      $.ajax({
        url: `http://localhost:3000/audit-assign/emp-no-emp-name?emp_no=${employeeNumber}`,
        method: "GET",
        success: function (response) {
          console.log(response);
          auditorNameInputElement.value = response.answer.emp_name;
        },
        error: function (error) {
          console.error("Error fetching data:", error);
          errorMessageElement.textContent = error.responseJSON.message;
        }
      });
    } else if (employeeNumber.length > 6) {
      errorMessageElement.textContent = "Please enter only 6 digit employee number.";
    } else {
      auditorNameInputElement.value = "";
      errorMessageElement.textContent = "";
    }
}
//Audit Assign fetch Employee name on Employee ID input - END


/**change in department list in dropdown on change of location value - START*/
function filterDeptOptionList(event){
  event.preventDefault();
  let selectedLocationId = event.target.value;
  // console.log("filterDeptOptionList func");

  // console.log("selected location id", selectedLocationId);

  // console.log("location dept mapping array", locationDepartment);

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
/**change in department list in dropdown on change of location value - START*/

/**function to handle data on clicking submit button - START*/
function submitForm() {
  // Perform the submit action here
  let employeeNumber = document.getElementById('employee-number').value;
  let auditorName = document.getElementById('auditor-name').value;
  let locationID = document.getElementById('location-select').value;
  let departmentID = document.getElementById('department-select').value;
  let scheduledStartDate = document.getElementById('scheduledStartDate').value;
  let scheduledEndDate = document.getElementById('scheduledEndDate').value;

 

  // console.log('submit Form inputs: ',employeeNumber, auditorName, locationID, departmentID, scheduledStartDate, scheduledEndDate)

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
      'scheduledEndDate': new Date(scheduledEndDate).toISOString(),
      'userID': sessionStorage.getItem('userID')
    }

     // Convert the date strings to Date objects
  let startDate = new Date(scheduledStartDate);
  let endDate = new Date(scheduledEndDate);

  if (startDate > endDate) {
    alert("Start date cannot be greater than end date");
    return; // Stop form submission
  }
    // console.log('audit assign submiti form data', JSON.stringify(formData));
  
    //submit ajax call to submit audit assign form data
    $.ajax({
      url: "http://localhost:3000/audit-assign/submitForm",
      type: 'POST',
      data: formData,
      success: function (response){
        // console.log(response);
        // alert("Form submitted successfully!");
        closeConfirmation();
        showConfirmationyes();
        
        // window.location.href = 'AuditAssign.html'; //clear form
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
    // console.log(JSON.stringify(formData));
    // alert('Following fields are empty: - ' + nullList.toString());
    confirmationcancel('Following fields are empty: - ' + nullList.toString());
  }
}
/**function to handle data on clicking submit button - START*/

// popup massage                                                                                                                                                                                                                      /****yes */
function showConfirmationyes() {
  var popup = document.getElementById("confirmationPopupyes");
  popup.style.display = "block";

  setTimeout(function () {
    popup.style.display = "none";
      window.location.href = 'AuditAssign.html'; 
  }, 3000);
}


//cancel
function confirmationcancel(msg){
  var popup = document.getElementById("confirmationPopupcancel");
  let headingElement = document.createElement('h3');
  headingElement.innerText = msg;
  popup.append(headingElement);
  popup.style.display = "block";

  setTimeout(function () {
    popup.style.display = "none";
    headingElement.innerText = '';
  }, 3000);

}