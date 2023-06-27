$(document).ready(function() {
  console.log("document ready");
  load_data();
  let asset_id ;
    let asset_type ;
    let asset_name;
    let dept_name ;
    let emp_name ;
    let emp_no ;
    let location_name ;

  function load_data() {
    console.log("Loading");
  
    $.ajax({
      url: "http://localhost:3000/AllAssets",
      method: "POST",
      data: { action: 'fetch' },
      dataType: "JSON",
      success: function(data) {
        var html = '';
     

        console.log('data length on doc ready function', data.answer.allPages.total_rows);

        all_rows = data.answer.allPages.total_rows;

        $(".table-body").html(html);

        //$(".table-body")[0].style.display = 'none';

        getPagination('.table-body', 1);
      }
    });
  }


  $(document).on("click", ".edit-btn", function() {
   

    //find the closest tr for the clicked edit btn
    let trElement = $(this).closest('tr');
    //console.log(trElement);
  
    //find all the td elements in the trElement
    let tdArray = trElement[0].getElementsByTagName('td');

    //select 1st td for asset_id and 2nd td element for asset type
     asset_id = tdArray[0].innerText;
     asset_type = tdArray[1].innerText;
     asset_name = tdArray[2].innerText;
     dept_name = tdArray[3].innerText;
    emp_name = tdArray[4].innerText;
    emp_no = tdArray[5].innerText;
    location_name = tdArray[6].innerText;

    console.log('asset_id on click: ' + asset_id + ' '+ asset_type);
    console.log("details ", location_name,asset_name);

    call_edit_registration_popup($(this), asset_id, asset_type, asset_name, dept_name, emp_name, emp_no, location_name);
  });

  function edit(asset_id, asset_type, asset_name, dept_name, emp_name, emp_no, location_name){
    $.ajax({
      url: "http://localhost:3000/editAssets",
      method: "POST",
      data: {
        asset_id:asset_id,
    asset_type:asset_type,
   asset_name:asset_name,
       dept_name:dept_name,
     emp_name:emp_name,
       emp_no:emp_no,
     location_name:location_name,
      },
      success: function (response) {
        if (response.code == "Updation_done_Successfully") {
          alert(response.response);
          console.log(response.response);
        }
        else {
          alert(response.response);
          console.log(response.response);

        }
        console.log(1);
        console.log(location_name, asset_name);

      }
    });
  
  }

function call_edit_registration_popup(e, asset_id, asset_type, asset_name, dept_name, emp_name, emp_no, location_name){
  let thisBtn = $(e);
  // location_atype();
  console.log(thisBtn[0]);
  
  let editBtn = thisBtn[0]; //document.getElementsByClassName('edit-btn');
  // select the modal-background
  let modalBackgroundEdit = document.getElementById('modal-background-edit-asset');
  // select the close-btn 
  let closeBtnEdit = document.getElementById('close-btn-edit-asset');

  ///   select the edit page  
  let editpages=document.querySelector('wrapper-edit')

  ///flag to track if close buuton is clicked then
  let isCloseBtnEdit=false;

  // shows the modal when the user clicks open-btn
  modalBackgroundEdit.style.display = 'block';


  //set values to the fields in edit registration form
  $('#asset-id-edit-asset').val(asset_id);
  $('#asset-type-edit-asset').val(asset_type);
  $('#asset-name-edit-asset').val(asset_name);
  $('#department-name-edit-asset').val(dept_name);
  $('#employee-name-edit-asset').val(emp_name);
  $('#employee-id-edit-asset').val(emp_no);
  $('#asset-location-edit-asset').val(location_name);
  // hides the modal when the user clicks close-btn
  closeBtnEdit.addEventListener('click', function () {
      modalBackgroundEdit.style.display = 'none';
      isCloseBtnEdit=true;
  });

  // hides the modal when the user clicks outside the modal
  window.addEventListener('click', function (event) {
      // check if the event happened on the modal-background
      if (event.target === modalBackgroundEdit) {
        if(!isCloseBtnEdit){
          return;
        }
        isCloseBtnEdit=false;
      }
      if(!modalBackgroundEdit(event.target))
      {
        return;
      }
          // hides the modal
          modalBackgroundEdit.style.display = 'none';
      
  });

  $('#save-btn').click(function(e){
    e.preventDefault();
    edit($('#asset-id-edit-asset').val(), $('#asset-type-edit-asset').val(), $('#asset-name-edit-asset').val(), $('#department-name-edit-asset').val(), 
    $('#employee-name-edit-asset').val(),  $('#employee-id-edit-asset').val(), $('#asset-location-edit-asset').val())
  })
}

/**   Paginazation part */
let all_rows;
///it's try//
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
//var apiUrl = ;
// Send a request  to the API to fetch the data for the specified page and page size

$.ajax({
  url: "http://localhost:3000/AllAssets",
  method: "POST",
  data: {
    page_number: currentPage,
    page_size: maxRows//$('#maxRows')[0].options[$('#maxRows')[0].selectedIndex].value //pageSize
  },
  success: function(response) {
    var data = response.answer.answer; // Assuming the API response contains the data in the 'data' property
    var message=response.answer.allPages  // total number of page 
    console.log("response pagination", data);

    console.log(message.total_rows);
    all_rows=message.total_rows
    console.log(all_rows)
    // Update the table with the fetched data
    
    $(tableBodyElement).html(""); // Clear the table body

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var html = "<tr>";
      html += "<td>" + row.asset_id + "</td>";
              html += "<td>" + row.asset_type + "</td>";
              html += "<td>" + row.asset_name + "</td>";
              html += "<td>" + row.dept_name + "</td>";
              html += "<td>" + row.emp_name + "</td>";
              html += "<td>" + row.emp_no + "</td>";
              html += "<td>" + row.location_name + "</td>";
              html += `<td><button class="btn-info edit-btn">Edit</button></td></tr>`;
      html += "</tr>";
      $(tableBodyElement).append(html);
    }
  },
  error: function(error) {
    console.error("Error fetching table data:", error);
  }
});
}(currentPage);

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


  console.log("Total row", all_rows);

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
limitPagging();

fetchTableData(lastPage, maxRows, tableBodyElement);
})
})







///  Advance searching ✈

/**/


///  document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
document.addEventListener("DOMContentLoaded", function() {
var filterAssetIdInput = document.getElementById("filter-asset-id");
var filterAssetTypeSelect = document.getElementById("filter-asset-type");
var filterAssetNameInput = document.getElementById("filter-asset-name");
var filterDeptNameSelect = document.getElementById("filter-dept-name");
var filterEmpNameInput = document.getElementById("filter-emp-name");
var filterEmpNoInput = document.getElementById("filter-emp-no");
var filterLocationNameSelect = document.getElementById("filter-location-name");
///here filter the data
filterAssetIdInput.addEventListener("input", filterTable);
filterAssetTypeSelect.addEventListener("change", filterTable);
filterAssetNameInput.addEventListener("input", filterTable);
filterDeptNameSelect.addEventListener("change", filterTable);
filterEmpNameInput.addEventListener("input", filterTable);
filterEmpNoInput.addEventListener("input", filterTable);
filterLocationNameSelect.addEventListener("change", filterTable);
///Pop
function populateDropdown(selectElement, options) {
  options.forEach(function(option) {
    var optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
}
/// Mantosh work starts here
function fetchData() {
  fetch('http://localhost:3000/fetch')
    .then(res => res.json())
    .then(data => {
      const { message, answer, answer2 } = data;

      const dept_name_list = message.dept_name.map((dept) => {
        return dept.dept_name;
      });
      const asset_type_list = answer.asset_type.map((asset) => {
        return asset.asset_type;
      });
      const location_name_list = answer2.location_name.map((location) => {
        return location.location_name;
      });

      populateDropdown(filterDeptNameSelect, dept_name_list);
      populateDropdown(filterAssetTypeSelect, asset_type_list);
      populateDropdown(filterLocationNameSelect, location_name_list);
    })
    .catch(err => console.error(err));
}

// Mantosh works end here




///  Function use for     Filter the latter uperCase to Lowercase
  function filterTable() {
    var filterAssetId = filterAssetIdInput.value.toUpperCase();
    var filterAssetType = filterAssetTypeSelect.value.toUpperCase();
    var filterAssetName = filterAssetNameInput.value.toUpperCase();
    var filterDeptName = filterDeptNameSelect.value.toUpperCase();
    var filterEmpName = filterEmpNameInput.value.toUpperCase();
    var filterEmpNo = filterEmpNoInput.value.toUpperCase();
    var filterLocationName = filterLocationNameSelect.value.toUpperCase();

    var tableBody = document.querySelector(".table-body");
    var rows = tableBody.getElementsByTagName("tr");
    var dataFound = false;

    for (var i = 0; i < rows.length; i++) {
      var assetId = rows[i].getElementsByTagName("td")[0].textContent.toUpperCase();
      var assetType = rows[i].getElementsByTagName("td")[1].textContent.toUpperCase();
      var assetName = rows[i].getElementsByTagName("td")[2].textContent.toUpperCase();
      var deptName = rows[i].getElementsByTagName("td")[3].textContent.toUpperCase();
      var empName = rows[i].getElementsByTagName("td")[4].textContent.toUpperCase();
      var empNo = rows[i].getElementsByTagName("td")[5].textContent.toUpperCase();
      var locationName = rows[i].getElementsByTagName("td")[6].textContent.toUpperCase();

      var locationMatch = filterLocationName === '' || locationName === filterLocationName;

      if (
        assetId.includes(filterAssetId) &&
        assetType.includes(filterAssetType) &&
        assetName.includes(filterAssetName) &&
        deptName.includes(filterDeptName) &&
        empName.includes(filterEmpName) &&
        empNo.includes(filterEmpNo) &&
        locationMatch
      ) {
        rows[i].style.display = "";
        dataFound = true;
      } else {
        rows[i].style.display = "none";
      }
    }

    var noDataMessage = document.getElementById("no-data-message");
    if (dataFound) {
      noDataMessage.style.display = "none";
    } else {
      noDataMessage.style.display = "block";
      noDataMessage.textContent = "No data available in the table.";
    }
  }

  // Fetch initial data and populate dropdowns
  fetchData();
});

///  Advance searching ✈✌

// $(document).on('click', '#adv_open-btn', function(event) {
//   event.preventDefault(); // Prevent form submission

//   // Retrieve search criteria values
//   var assetType = $("input[name='asset-type']").val();
//   var assetName = $("input[name='asset-name']").val();
//   var departmentName = $("input[name='department-tagid']").val();
//   var employeeName = $("input[name='employee-name']").val();
//   var employeeNo = $("input[name='employee-id']").val();
//   var assetLocation = $("input[name='asset-location']").val();

//   $.ajax({
//     url: "http://localhost:3000/advance-search-asset", //  API
//     method: "GET",
//     data: {
//       action: 'search',
//       assetType: assetType,
//       assetName: assetName,
//       departmentName: departmentName,
//       employeeName: employeeName,
//       employeeNo: employeeNo,
//       assetLocation: assetLocation
//     },
//     dataType: "JSON",
//     success: function(response) {
//       if (response.code == "NO_DATA_FOUND") {
//         $(".table-body").empty(); // Clear the table body
//         $(".no-data-message").text("Data not found"); // Update the message
//         $(".no-data-message").show(); // Show the message
//       } else {
//         $(".no-data-message").hide(); // Hide the message

//         var html = '';
//         for (let i = 0; i < response.data.length; i++) {
//           html += `
//             <tr>
//               <td>${response.data[i].asset_id}</td>
//               <td>${response.data[i].asset_type}</td>
//               <td>${response.data[i].asset_name}</td>
//               <td>${response.data[i].dept_name}</td>
//               <td>${response.data[i].emp_name}</td>
//               <td>${response.data[i].emp_no}</td>
//               <td>${response.data[i].location_name}</td>
//               <td><button class="btn-info edit-btn">Edit</button></td>
//             </tr>
//           `;
//         }

//         $(".table-body").html(html);

//         getPagination('.table-body');

//         // Clear form data
//      // Assuming the popup button has a class called 'popup-btn'
//       //$(document).on('click', '.adv_open-btn', function() {
//         // Reset the form data
//         $('#myForm')[0].reset();

//         // Hide the no-data message
//         $(".no-data-message").hide();
//       //});
//         // Hide pop-up
//         $('#modal-background-advance-search').hide();
//       }
//     }
//   });
// })


///soumyak code

///  document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.


//single asset Reg form

// Mantosh work starts here



fetch('http://localhost:3000/fetchdname')
.then(res => res.json())
.then(data => {

  dept_nm=data;
  console.log(dept_nm)
 const { message,answer} = data
  const dept_name_list = message.dept_name.map((dept) => {
    return dept.dept_name;
  });
  const asset_type_list = answer.asset_type.map((asset) => {
    return asset.asset_desc;
  });
  console.log(dept_name_list);
  var selectElement = document.getElementById('dname');

  dept_name_list.forEach(element => {
    $('#dname')[0].appendChild(new Option(element, element, false, false))
  });
  //$('#dname').val(message.dept_name);
  asset_type_list.forEach(element => {
    $('#asset-type')[0].appendChild(new Option(element, element, false, false))
  });
  
})
.catch(err => console.error(err))

// for tag_uuid branch wise automation
function updateField() {
  var branch = document.getElementById("dname").value;
  var field = document.getElementById("tag_uuid");

  if (branch.trim() === '') {
    alert("department field is mandatory.");
    return;
  }

  field.value = "SA/" +branch.toLowerCase()+"/xy"+ "/1009";
  field.disabled = false;
  // field.addEventListener('input', function() {
  //   var parts = field.value.split('/');
  //   parts[1] = 'cse';
  //   field.value = parts.join('/');
  // });
}

function assetclass(){
  let atype=document.getElementById('asset-type').value
  let at = encodeURIComponent(atype)
  console.log('at: '+at);
  fetch('http://localhost:3000/assetclass?at='+at)
  .then(res => res.json())
  .then(data=>{
    console.log(data.message);

    if(data.message){
      $('#asset-class').val(data.message.asset_class);
    }
    else{
      document.getElementById('asset-class').value="";
    
    }
  })
  .catch(error=> console.error(error));
}


function fetchData(){
  var dn=document.getElementById('dname').value
  //console.log('dn: '+dn);
  fetch('http://localhost:3000/ddata?dn='+dn)
  .then(res => res.json())
  .then(data=>{
    console.log(data.message);

    if(data.message){
      $('#did').val(data.message.dept_id);
    }
    else{
      document.getElementById('did').value="";
    
    }
  })
  .catch(error=> console.error(error));
}
function total(){
  fetchData();
  updateField();
}

// Mantosh work ends here


//Function to reset the form fields

// Define a reset function
function resetForm() {
  // Reset the form fields
  aid.value = '';
  aname.value = '';
  assetcl.value = '';
  atype.value = '';
  assetpi.value = '';
  $('#dname')[0].selectedIndex = 0;
  di.value = '';
  empno.value = '';
  taguid.value = '';

  // Fetch asset type options from the backend
  fetchData('http://localhost:3000/asset-types', function(response) {
    // Assuming the response is an array of asset types
    atype.innerHTML = ''; // Clear existing options

    // Create and append new option elements
    response.forEach(function(assetType) {
      var option = document.createElement('option');
      option.value = assetType;
      option.text = assetType;
      atype.appendChild(option);
    });
  });

  // Fetch department names from the backend
  fetchData('http://localhost:3000/departments', function(response) {
    // Assuming the response is an array of department objects {name, id}
    di.innerHTML = ''; // Clear existing options

    // Create and append new option elements
    response.forEach(function(department) {
      var option = document.createElement('option');
      option.value = department.id;
      option.text = department.name;
      di.appendChild(option);
    });
  });

   // Reset the department name field
   document.getElementById('dname').value = '';

  //  document.getElementById('did').value = '';

  // Fetch asset class and tag UUID from the backend
  fetchData('http://localhost:3000/asset-class-and-tag-uuid', function(response) {
    // Assuming the response contains assetClass and tagUuid properties
    assetcl.value = response.assetClass;
    taguid.value = response.tagUuid;
  });
}

// $(document).ready(function(){

 let aid = document.getElementById('asset-id');

let aname = document.getElementById('asset-name');

let assetcl=document.getElementById('asset-class');

let atype = document.getElementById('asset-type');

let assetpi = document.getElementById('asset-price');

let di = document.getElementById('did');

let empno = document.getElementById('emp_no');

let taguid = document.getElementById('tag_uuid');


document.getElementById('submitAssetForm').addEventListener('click', (function(e){
  e.preventDefault();
  let assetdv = aid.value;
  let assetnv = aname.value;
  let assetcv=assetcl.value;
  let assettv = atype.value;
  let assetpv = assetpi.value;
  let deptidv = di.value;
  let empidv = empno.value;
  let taguidv= taguid.value;

  // Validate input fields
  if (!assetdv || !assetnv || !assettv || !assetpv || !deptidv || !empidv || !taguidv) {
    alert('Please fill in all required fields.');
    return;
  }

    // Validate tag UUID format
  var tagUuidRegex = /^SA\/[a-z]{3}\/[a-z]\d\/\d{4}$/;
  if (!tagUuidRegex.test(taguidv)) {
    alert("Invalid tag UUID format");
    return;
  }

    // Validate empId format
  var empIdRegex = /^\d{6}$/;
if (!empidv.match(empIdRegex)) {
alert('Employee ID must be a 6-digit number.');
return;
}

// Validate asset ID based on asset class

// var assetIdRegex = /^\d{12}$/;
// if (!assetdv.match(assetIdRegex)) {
// alert('Asset ID must be a 12-digit number.');
// return;
// }


var assetClassValue = assetcl.value; 

var assetIdRegex = new RegExp('^' + assetClassValue + '\\d{10}$');

if (!assetdv.match(assetIdRegex)) {
  alert('Invalid asset ID(12-digits) for the specified asset class.');
  return;
}


// Set the URL and request method
  var url = 'http://localhost:3000/assetreg'; // Replace with your server-side script URL
  var method = 'POST'; // Replace with the desired request method
// console.log(assetdv )
  // Send the form data using AJAX
  $.ajax({
    url: url,
    type: method,
    data: {assetd:assetdv,
      assetn: assetnv,
      assett: assettv,
      assetp:assetpv,
      deptid:deptidv,
      empid:empidv,
      taguid:taguidv,
      assetc:assetcv},
      
    success: function(response) {
     
      //Handle the successful response

      if(response.code == "Insertion has been done to tags and assets"){
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else if(response.code == "Insertion has been done to tags"){
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else if(response.code == "Insertion has been done to assets"){  
        alert(response.response);
        console.log(response.response);
        resetForm();
      }
      else{
        alert(response.response);
        console.log(response.response);
      }
    
      
      

    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.log(error);
    }
  });
})
);

//satyam multipleasset upload ajax
$(document).ready(function () {
  $('#uploadBtns').on('click', function (e) {
    e.preventDefault();
    var fileInput = $('#uploadFile')[0];
    var file = fileInput.files[0];

    if (file) {
      var formData = new FormData();
      formData.append('uploadFile', file);

      $.ajax({
        url: 'http://localhost:3000/assetupload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          $('#mess').text(response);
          console.log(response);
          alert(response);
        },
        error: function (error) {
          $('#mess').text('Error uploading file.');
        }
      });
    }
  });
});


///edit part
// function location_atype() {


//   fetch('http://localhost:3000/editfetch')
//     .then(res => res.json())
//     .then(data => {



//       const { message, answer } = data
//       const location_name_list = message.location_name.map((location) => {
//         return location.location_name;
//       });
//       const asset_type_list = answer.asset_type.map((asset) => {

//         return asset.asset_desc;
//       });
//       console.log(location_name_list);
//       console.log(asset_type_list)
//       // var selectElement = document.getElementById('dname');

//       location_name_list.forEach(element => {
//         $('#asset-location')[0].appendChild(new Option(element, element, false, false))
//       });
//       //$('#dname').val(message.dept_name);
//       asset_type_list.forEach(element => {
//         $('#asset_type')[0].appendChild(new Option(element, element, false, false))
//       });

//     })
//     .catch(err => console.error(err))
// }