let locationDetails = [];
let departmentDetails = [];
let locationDepartment = [];

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

    if(selectedLocationId && selectDepartmentId){
      $.ajax({
        url:`http://localhost:3000/audit-assign/fetch-expected-assets?selectedLocationId=${selectedLocationId}&selectDepartmentId=${selectDepartmentId}`,
        method: "GET",
          success: function (response) {
            console.log(response);

          },
          error: function(error) {
            console.error("Error fetching data:", error);
          }
      })
    }
  }
})


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
  let employeeNumber = document.getElementById('employee-number');
  let auditorName = document.getElementById('auditor-name');
  let locationName = document.getElementById('location-select');
  let departmentName = document.getElementById('department-select');
  let scheduledStartDate = document.getElementById('scheduledStartDate');
  let scheduledEndDate = document.getElementById('scheduledEndDate');

  let nullList = new Array();
  if(employeeNumber == '')  nullList.push('Employee No');
  if(auditorName == '')  nullList.push('Auditor Name');
  if(locationName == '')  nullList.push('Location Name');
  if(departmentName == '')  nullList.push('Department Name');
  if(scheduledStartDate.length == 0)  nullList.push('Start Date');
  if(scheduledEndDate.length == 0)  nullList.push('End Date');

  if(nullList.length > 0){
    let formData = {
      'employeeNumber': employeeNumber,
      'auditorName': auditorName,
      'locationName': locationName,
      'departmentName': departmentName,
      'scheduledStartDate': scheduledStartDate,
      'scheduledEndDate': scheduledEndDate
    }
    console.log('audit assign submiti form data', JSON.stringify(formData));
  
    //submit ajax call to submit audit assign form data
    $.ajax({
      url: "http://localhost:3000/audit-assign/submitForm",
      type: 'POST',
      data: formData,
      success: function (response){
        console.log(response);
        alert("Form submitted successfully!");
        closeConfirmation();
      },
      error: function(error){
        console.error(error);
      }
    })
  }
  else{
    alert('Following fields are empty: - ' + nullList.toString());
  }
}