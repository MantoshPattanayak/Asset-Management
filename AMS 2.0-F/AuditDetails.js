//**************************************Audit Status********************************************************************************* */


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
  $.ajax({
    url: `http://localhost:3000/audit-asset/fetch-data?auditID=${auditID}`,
    type: 'GET',
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

      //function to display data in table

      function dispalyData(data){
        let html='';
        for(let i=0;i<data.length;i++){
          html+=``
        }
      }


      // var tableBody = $('#table-1 tbody');
      // tableBody.empty(); // Clear existing table rows

      // // Iterate over the data and create table rows
      // response.tableData.forEach(function(rowData) {
      //   var row = $('<tr>');

      //   // Iterate over the row data and create table cells
      //   Object.values(rowData).forEach(function(cellData) {
      //     var cell = $('<td>').text(cellData);
      //     row.append(cell);
      //   });

      //   tableBody.append(row);
      // })

      // Update the data for the pie chart
      try {
        myChart.data.datasets[0].data = [
          (response.assetCountData[0].FoundAssetCount / response.assetCountData[0].TotalAssets) * 100,
          (response.assetCountData[0].NewAssetCount / response.assetCountData[0].TotalAssets) * 100,
          (response.assetCountData[0].MissingAssetCount / response.assetCountData[0].TotalAssets) * 100
          //response.newAssets
        ];
      
        // Display data value
        console.log(myChart.data.datasets[0].data);
      } catch (error) {
        // Display "none" when there is no data
        console.log("none");
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
    },
    error: function() {
      console.log('Error fetching data from the backend.');
    }
  });
});

// Function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  

//**********************************************Auditor Status******************************************************************************* *

//   $.ajax({
//     url: 'backend_url',
//     type: 'GET',
//     success: function(response) {
//       $('.aduit-scope-input').val(response.auditorName).prop('readonly', true);
//       $('.aduit-scope-input').val(response.auditStatus).prop('readonly', true);
//       $('.aduit-scope-input').val(response.scheduledStartDate).prop('readonly', true);
//     },
//     error: function() {
//       console.log('Error fetching data from the backend.');
//     }
//   });
  

//   // *************************************************Scanned Status*********************************************************************************

//   $.ajax({
//     url: 'backend_url',
//     type: 'GET',
//     success: function(response) {
//       $('.aduit-scope-input').val(response.scannedAndExpected).prop('readonly', true);
//       $('.aduit-scope-input').val(response.scannedAndNotExpected).prop('readonly', true);
//       $('.aduit-scope-input').val(response.expectedAndNotFound).prop('readonly', true);
//       $('.aduit-scope-input').val(response.newAssets).prop('readonly', true);
//     },
//     error: function() {
//       console.log('Error fetching data from the backend.');
//     }
//   });

 
  
//   // ****************************************************for pie-chart-visualisation purposes****************************************************************


//   // Fetch data from the backend
// $.ajax({
//     url: 'backend_url',
//     type: 'GET',
//     success: function(response) {
//       // Update the data for the pie chart
//       myChart.data.datasets[0].data = [
//         response.notFound,
//         response.notExpected,
//         response.expected,
//         response.newAssets
//       ];
  
//       // Update the pie chart labels
//       myChart.data.labels = [
//         "Not Found",
//         "Not Expected",
//         "Expected",
//         "New"
//       ];
  
//       // Update the pie chart colors (if desired)
//       myChart.data.datasets[0].backgroundColor = [
//         "#2ecc71",
//         "#9b59b6",
//         "#f1c40f",
//         "#e74c3c"
//       ];
  
//       // Update the pie chart
//       myChart.update();
//     },
//     error: function() {
//       console.log('Error fetching data from the backend.');
//     }
//   });
    
