//**************************************Audit Status********************************************************************************* */


// Function to fetch data from the backend
let auditID = sessionStorage.getItem('auditID');
// Call the fetchData function when the document is ready
$(document).ready(function() {
    fetchData();
  });
  

function fetchData() {
    // Make an AJAX request
    $.ajax({
      url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}`, // Replace 'backend_url' with the actual URL of your backend endpoint
      type: 'GET',
      success: function(response) {
        // Set the values of input fields
        $('.aduit-scope-input').val(response.auditNumber).prop('readonly', true);
        $('.aduit-scope-input').val(response.auditScope).prop('readonly', true);
        $('.aduit-scope-input').val(response.location).prop('readonly', true);
        $('.aduit-scope-input').val(response.scheduledEndDate).prop('readonly', true);
      },
      error: function() {
        // Handle error case
        console.log('Error fetching data from the backend.');
      }
    });
  }
  
  

//**********************************************Auditor Status******************************************************************************* *

  $.ajax({
    url: 'backend_url',
    type: 'GET',
    success: function(response) {
      $('.aduit-scope-input').val(response.auditorName).prop('readonly', true);
      $('.aduit-scope-input').val(response.auditStatus).prop('readonly', true);
      $('.aduit-scope-input').val(response.scheduledStartDate).prop('readonly', true);
    },
    error: function() {
      console.log('Error fetching data from the backend.');
    }
  });
  

  // *************************************************Scanned Status*********************************************************************************

  $.ajax({
    url: 'backend_url',
    type: 'GET',
    success: function(response) {
      $('.aduit-scope-input').val(response.scannedAndExpected).prop('readonly', true);
      $('.aduit-scope-input').val(response.scannedAndNotExpected).prop('readonly', true);
      $('.aduit-scope-input').val(response.expectedAndNotFound).prop('readonly', true);
      $('.aduit-scope-input').val(response.newAssets).prop('readonly', true);
    },
    error: function() {
      console.log('Error fetching data from the backend.');
    }
  });

 
  
  // ****************************************************for pie-chart-visualisation purposes****************************************************************


  // Fetch data from the backend
$.ajax({
    url: 'backend_url',
    type: 'GET',
    success: function(response) {
      // Update the data for the pie chart
      myChart.data.datasets[0].data = [
        response.notFound,
        response.notExpected,
        response.expected,
        response.newAssets
      ];
  
      // Update the pie chart labels
      myChart.data.labels = [
        "Not Found",
        "Not Expected",
        "Expected",
        "New"
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
    },
    error: function() {
      console.log('Error fetching data from the backend.');
    }
  });
    