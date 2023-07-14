$(document).ready(function(){
    if (sessionStorage.getItem('sessionVar') != 'pass' && sessionStorage.getItem('sessionVar') != 'userPass') {
        window.location.href = `./index.html`;
    }

    $.ajax({
      url: "http://localhost:3000/audit-overview/audit_roll_check?employeeID="+sessionStorage.getItem('userID'),
      method: "GET",
      data: {
      },

      dataType: "",
      success: function(user_type) {
        console.log(user_type)
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
                    <a href="./dashboard.html"><i class='bx bxs-dashboard'></i></a>
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

    $('#audit-submit').on('click', function(event) {
        event.preventDefault(); // Prevent form submission
    
        let employeeNumber = $('#fieldName').val();
        let fromDate = $('#startDate').val();
        let toDate = $('#endDate').val();

         // Check if fromDate and toDate are empty
         if (fromDate === '' || toDate === '') {
            alert('Please select both Start Date and End Date.');
            return; // Stop further execution
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

        if(new Date($('#startDate').val()).toISOString() <= new Date($('#endDate').val()).toISOString()){
            $.ajax({
                url: `http://localhost:3000/audit-report/submitData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
                type: 'GET',
                success: function(response){
                    console.log(response);
                    // Handle the data
                    var tableContainer = document.getElementById('tableContainer');
                    tableContainer.innerHTML = ''; // Clear previous content

                     // Show the table and export button
                     $('.sumary-table').show();
                     $('.csv-pdf').show();
                     //$('.pagination-container').show();
                     
                
/**************************************** Generate HTML content for the table****************************************************✈️✈️*/
                    var tableHTML = `<table>
                                        <thead class="head">
                                            <tr>
                                                <th>Audit No</th>
                                                <th>Emp No</th>
                                                <th>Auditor Name</th>
                                                <th>Location Name</th>
                                                <th>Department Name</th>
                                                <th>Scheduled Start Date</th>
                                                <th>Scheduled End Date</th>
                                                <th>Total Assets Found</th>
                                                <th>Total Assets Missing</th>
                                                <th>Total Assets New</th>
                                                <th>Download</th>
                                            </tr>



                                        </thead>
                                        <tbody>`;
                    response.tableData.forEach(function(item) {
                        tableHTML += 
                                    `<tr>
                                        <td>${item.Id}</td>
                                        <td>${item.EmployeeNo}</td>
                                        <td>${item.AuditorName}</td>
                                        <td>${item.location_name}</td>
                                        <td>${item.dept_name}</td>
                                        <td>${item.ScheduledStartDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null"}</td>
                                        <td>${item.ScheduledEndDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null"}</td>
                                        <td>${item.FoundAssetCount}</td>
                                        <td>${item.MissingAssetCount}</td>
                                        <td>${item.NewAssetCount}</td>
                                        <td>
                                            <div class="csv-pdf">
                                                <button class="pdf" onclick="downloadAsPDFFile(event, $(this))">PDF</button>
                                                <button class="csv" onclick="downloadAsCSVFile(event, $(this))">CSV</button>
                                            </div>
                                      </td>
                                    </tr>`


                                    
                    });
                    tableHTML += '</tbody></table>';
                
                    /************ Update the HTML content in the table container**********************/
                    tableContainer.innerHTML = tableHTML;
                },
                error: function(error){
                    console.log(error);
                }
            })
        }
        else{
            alert('Start Date should be less than End Date!!!');
        }
    });
})

/***********************************************✈️✈️✈️*******************************************************************************/

function checkInputValue(event){
    if (!(event.keyCode >= 48 && event.keyCode <= 57)) {
        event.preventDefault();
        return false;
    }
}

//*******************************Download the csv file of according to  Audit Number (Report page )**************************************✈️✈️ */

function downloadAsCSVFile(e, element){
    console.log('download CSV File!!!');
    e.preventDefault();
    
    let auditID = $(element).closest('tr').find('td').eq(0).text();

  console.log("autid id 1", auditID);
  if(auditID!= ''){
    generateCSVReportRow(auditID);
}
}

function generateCSVReportRow(auditID) {
    // Fetch the data from the server
    $.ajax({
      url: `http://localhost:3000/audit-report/downloadData?auditID=${auditID}`,
      type: 'GET',
      success: function (response) {
        // Handle the data
        console.log(response);
        let tableData1 = response.assetAuditDetails;
        console.log("tableData1", tableData1);
  
        // Set the table header
        var tableHeader = ['Asset Status', 'Asset class', 'Asset Id', 'Asset Name', 'Asset Type', 'Location Name', 'Tag Id', 'Tag uuid'];
  
        // Set the table rows
        var tableRows1 = tableData1.map(function (item) {
          return [
            item.AssetStatus,
            item.asset_class,
            item.asset_id,
            item.asset_name,
            item.asset_type,
            item.location_name,
            item.tag_id,
            item.tag_uuid
          ];
        });
  
        // Concatenate header and rows
        var csvData = [tableHeader].concat(tableRows1);
  
        // Calculate the maximum width for each column
        var columnWidths = csvData.reduce(function (widths, row) {
          return row.map(function (cell, index) {
            var cellWidth = (cell !== null && cell !== undefined) ? cell.toString().length : 0;
            return Math.max(widths[index] || 0, cellWidth);
          });
        }, []);
  
        // Generate the formatted CSV content
        var csvContent = csvData.map(function (row) {
          return row.map(function (cell, index) {
            var cellValue = (cell !== null && cell !== undefined) ? cell.toString() : '';
            var paddedCell = cellValue.padEnd(columnWidths[index]);
            return '"' + paddedCell + '"';
          }).join(",");
        }).join("\n");
  
        // Create a temporary link element
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        link.setAttribute('download', 'audit_report.csv');
  
        // Simulate a click to trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: function (error) {
        console.log('At generateCSVReportRow:', error);
      }
    });
  }
  

/********************************Download the pdf of each Audi_no details**************************************************✈️✈️✈️*****/




function downloadAsPDFFile(e, element){
  
    e.preventDefault();
    console.log('export func');
  
    let auditID = $(element).closest('tr').find('td').eq(0).text();
   console.log(auditID);
  
  
    // Generate PDF report
    if(auditID!= ''){
        generatePDFReportRow(auditID);
    }
   
}

function generatePDFReportRow(auditID) {
    // Create a new jsPDF instance
    var doc = new jsPDF('landscape');
  
    // Fetch the data from the server
    $.ajax({
      url: `http://localhost:3000/audit-report/downloadData?auditID=${auditID}`,
      type: 'GET',
      success: function(response) {
        // Handle the data
        console.log(response);
        let tableData1 = response.assetAuditDetails;
        console.log("5".tableData1);
  
        // Format the date
        function formatDate(dateString) {
          const date = new Date(dateString);
          const year = date.getFullYear();
          let month = (date.getMonth() + 1).toString().padStart(2, '0');
          let day = date.getDate().toString().padStart(2, '0');
  
          return `${day}/${month}/${year} `;
        }
  
        // Set the table header
        var tableHeader = [['Asset Status', 'Asset class', 'Asset Id', 'Asset Name', 'Asset Type', 'Location Name', 'Tag Id', 'Tag uuid']];
  
        // Set the table rows
        console.log('1', tableData1);
        var tableRows1 = tableData1.map(function(item) {
          return [
            item.AssetStatus,
            item.asset_class,
            item.asset_id,
            item.asset_name,
            item.asset_type,
            item.location_name,
            item.tag_id,
            item.tag_uuid
          ];
        });
  
        console.log(tableRows1);
        doc.setFontSize(14);
        doc.text(`Audit Number: ${response.auditFormData.AuditNumber}`, 15, 35);
        doc.text(`Auditor Name: ${response.auditFormData.AuditorName}`, 195, 35);
  
        doc.text(`Start Date:  ${formatDate(response.auditFormData.ScheduledStartDate)}`, 15, 45);
        doc.text(`End Date: ${formatDate(response.auditFormData.ScheduledEndDate)}`, 195, 45);

        doc.text(`No. of Assets Found:  ${response.assetStatusList.FoundAssetCount}`, 15, 55);
        doc.text(`No. of Assets Missing: ${response.assetStatusList.MissingAssetCount}`, 195, 55);
        doc.text(`No. of Assets New:  ${response.assetStatusList.NewAssetCount}`, 15, 65);
  
        var reportTitle = 'AUDIT REPORT';
  
        // Set the report title
        var reportTitle = 'AUDIT REPORT';

        // Add Image to PDF code
        var imageUrlLeft = './images/soul_logo.jpg'; // Path to the left logo image
        var imageUrlRight = './images/kiit-logo-1.jpg'; // Path to the right logo image
  
  
        var getImageFromUrl = function(url, callback) {
            var img = new Image();
            img.onload = function() {
              callback(img);
            };
            img.src = url;
          };
  
          getImageFromUrl(imageUrlLeft, function(leftImg) {
            var leftCanvas = document.createElement('canvas');
            var leftContext = leftCanvas.getContext('2d');
            leftCanvas.width = leftImg.width;
            leftCanvas.height = leftImg.height;
            leftContext.drawImage(leftImg, 0, 0);
            var leftImgData = leftCanvas.toDataURL('image/jpeg');
  
          // Calculate the position and size for the image
          var leftX = 8;
          var leftY = 8;
          var leftWidth = 20;
          var leftHeight = (leftImg.height * leftWidth) / leftImg.width;
          // Add the image to the PDF
          doc.addImage(leftImgData, 'JPEG', leftX, leftY, leftWidth, leftHeight);




          /*******right */
          getImageFromUrl(imageUrlRight, function(rightImg) {
            var rightCanvas = document.createElement('canvas');
            var rightContext = rightCanvas.getContext('2d');
            rightCanvas.width = rightImg.width;
            rightCanvas.height = rightImg.height;
            rightContext.drawImage(rightImg, 0, 0);
            var rightImgData = rightCanvas.toDataURL('image/jpeg');
  
            // Calculate the position and size for the right logo image
            var rightWidth = 20;
            var rightHeight = (rightImg.height * rightWidth) / rightImg.width;
            var rightX = doc.internal.pageSize.width - rightWidth - 8;
            var rightY = 8;
  
            // Add the right logo image to the PDF
            doc.addImage(rightImgData, 'JPEG', rightX, rightY, rightWidth, rightHeight);
  
        // Calculate the center position
        var pageWidth = doc.internal.pageSize.width;
        var textWidth = doc.getStringUnitWidth(reportTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var centerX = (pageWidth - textWidth) / 2;
  
        // Add the report title
        doc.setTextColor('#006400'); // Set the text color to green
        doc.setFontSize(18); // Set the font size
        doc.text(reportTitle, centerX, 15);
  
        doc.autoTable({
          head: tableHeader,
          body: tableRows1.slice(1),
          startY: 70,
          styles: {
            cellPadding: 5,
            fontStyle: 'normal'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { fontStyle: 'bold' }
          }
        });
  
  
          // Add signature option
          var signatureText = 'Signature:';
          var signatureX = 20;
          var signatureY = 170; // Adjust the vertical position as needed
          var signatureLineHeight = 10;
  
          // Add the signature text and line
          doc.setFontSize(12);
          doc.setTextColor('#000000'); // Set the text color to black
          doc.text(signatureText, signatureX, signatureY);
          doc.setLineWidth(0.5);
          doc.line(signatureX, signatureY + 5, signatureX + 50, signatureY + 5);
           
           // Add the name below the signature
       var nameText = 'KIIT University Bhubaneswar';
       var nameX = signatureX;
       var nameY = signatureY + 15;
       // Set the text color to green
        doc.setTextColor('#006400');
        doc.text(nameText, nameX, nameY);
          // Add footer
          var totalPages = doc.internal.getNumberOfPages();
          for (var i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
          }
          
          //Reported Generated Date
          doc.setFontSize(12);
          doc.text(`Report generated on ${formatDate(Date())}`, 230, 185);

          // Add the "Soul Ltd" footer
          doc.setFontSize(12);
          doc.setTextColor('#006400'); // Set the text color to green
          doc.text('Copyright © 2023 All Rights Reserved by Soul Limited ', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, 'center');
  
          // Save and download the PDF file
          doc.save('audit_report.pdf');
        });
    });

    // Rest of the code...
  },
      error: function(error) {
        console.log(error);
      }
    });
  }
  

/**************************************Export Table  INOT PDF FILE**************************************************************✈️✈️✈️**/
function exportTable(event) {
    event.preventDefault();
    console.log('export func');
  
    let employeeNumber = $('#fieldName').val();
    let fromDate = $('#startDate').val();
    let toDate = $('#endDate').val();
  
    // Generate PDF report
    if(fromDate != '' && toDate != ''){
        generatePDFReport(employeeNumber, fromDate, toDate);
    }
  }
  
function generatePDFReport(employeeNumber, fromDate, toDate) {
    // Create a new jsPDF instance
    var doc = new jsPDF ('landscape');

    // Fetch the data from the server
    $.ajax({
        url: `http://localhost:3000/audit-report/downloadAuditData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
        type: 'GET',
        success: function(response) {
        // Handle the data
        console.log(response);
        var tableData = response.auditTableData;

        // Format the date
        // Format the date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
    
            return `${day}/${month}/${year} `;
          }
    

        // Set the table header
        var tableHeader = [['Audit No', 'Emp No', 'Auditor Name', 'Location Name', 'Department Name', 'Scheduled Start Date', 'Scheduled End Date', 'Total Assets Found', 'Total Assets Missing', 'Total Assets New']];
        
        // Set the table rows
        var tableRows = tableData.map(function(item) {
            return [
            item.Id,
            item.EmployeeNo,
            item.AuditorName,
            item.location_name,
            item.dept_name,
            formatDate(item.ScheduledStartDate),
            formatDate(item.ScheduledEndDate),
            item.FoundAssetCount,
            item.MissingAssetCount,
            item.NewAssetCount
            ];
        });

        console.log('tableRows', tableRows);

        doc.text(`Start Date  ${formatDate($('#startDate').val())}                                                                                           End Date ${formatDate($('#endDate').val())}   `, 10, 40);
    
      
        // Add the table to the document
        //doc.text('Audit Report', 10, 40,'center');
        //doc.autoTable(tableHeader, tableRows, tableOptions);
        // Set the report title
        var reportTitle = 'Audit Report';

        //Logo add
       // ...

// Set the report title
var reportTitle = 'Audit Report';

   // Add Image to PDF code
   var imageUrlLeft = './images/soul_logo.jpg'; // Path to the left logo image
   var imageUrlRight = './images/kiit-logo-1.jpg'; // Path to the right logo image


   var getImageFromUrl = function(url, callback) {
       var img = new Image();
       img.onload = function() {
         callback(img);
       };
       img.src = url;
     };

     getImageFromUrl(imageUrlLeft, function(leftImg) {
       var leftCanvas = document.createElement('canvas');
       var leftContext = leftCanvas.getContext('2d');
       leftCanvas.width = leftImg.width;
       leftCanvas.height = leftImg.height;
       leftContext.drawImage(leftImg, 0, 0);
       var leftImgData = leftCanvas.toDataURL('image/jpeg');

     // Calculate the position and size for the image
     var leftX = 8;
     var leftY = 8;
     var leftWidth = 20;
     var leftHeight = (leftImg.height * leftWidth) / leftImg.width;
     // Add the image to the PDF
     doc.addImage(leftImgData, 'JPEG', leftX, leftY, leftWidth, leftHeight);




     /*******right */
     getImageFromUrl(imageUrlRight, function(rightImg) {
       var rightCanvas = document.createElement('canvas');
       var rightContext = rightCanvas.getContext('2d');
       rightCanvas.width = rightImg.width;
       rightCanvas.height = rightImg.height;
       rightContext.drawImage(rightImg, 0, 0);
       var rightImgData = rightCanvas.toDataURL('image/jpeg');

       // Calculate the position and size for the right logo image
       var rightWidth = 20;
       var rightHeight = (rightImg.height * rightWidth) / rightImg.width;
       var rightX = doc.internal.pageSize.width - rightWidth - 8;
       var rightY = 8;

       // Add the right logo image to the PDF
       doc.addImage(rightImgData, 'JPEG', rightX, rightY, rightWidth, rightHeight);

   // Calculate the center position
   var pageWidth = doc.internal.pageSize.width;
   var textWidth = doc.getStringUnitWidth(reportTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
   var centerX = (pageWidth - textWidth) / 2;

  // Add the report title
  doc.setTextColor('#006400'); // Set the text color to green
  doc.setFontSize(18); // Set the font size
  doc.text(reportTitle, centerX, 15);
  // ...
        doc.autoTable({
            head: tableHeader,
            body: tableRows.slice(1),
            startY: 70,
            styles: {
              cellPadding: 5,
              //fontSize: fontSize,
              fontStyle: 'normal'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: {
              0: { fontStyle: 'bold' }
            }
          });

          //Add footer
          var totalPages = doc.internal.getNumberOfPages();
        for (var i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
        }
        //Reported Generated Date
        doc.setFontSize(12);
        doc.text(`Report generated on ${formatDate(Date())}`, 230, 185);
        
        // Add the "Soul Ltd" footer
        doc.setFontSize(12);
        doc.setTextColor('#006400'); // Set the text color to green
        doc.text('Copyright © 2023 All Rights Reserved by Soul Limited ', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, 'center');


        // Save and download the PDF file
        doc.save('audit_report.pdf');
    });
});

// Rest of the code...
},
  error: function(error) {
    console.log(error);
  }
});
}

/***********************************Export the data of table into CSV FILE*********************************************************✈️✈️✈️✈️*/
function exportTablecsv(event) {
    event.preventDefault();
    console.log('export func');
  
    let employeeNumber = $('#fieldName').val();
    let fromDate = $('#startDate').val();
    let toDate = $('#endDate').val();
  
    // Generate PDF report
    if(fromDate != '' && toDate != ''){
        generateCSVReportTable(employeeNumber, fromDate, toDate);
    }
  }


function generateCSVReportTable(employeeNumber, fromDate, toDate) {
    // Fetch the data from the server
    $.ajax({
        url: `http://localhost:3000/audit-report/downloadAuditData?fromDate=${fromDate}&toDate=${toDate}&employeeNumber=${employeeNumber}`,
      type: 'GET',
      success: function (response) {
        // Handle the data
        console.log(response);
        let tableData1 = response.auditTableData;
        console.log("tableData1", tableData1);


          // Format the date
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
        
  
        // Set the table header
        var tableHeader = [['Audit No', 'Emp No', 'Auditor Name', 'Location Name', 'Department Name', 'Scheduled Start Date', 'Scheduled End Date', 'Total Assets Found', 'Total Assets Missing', 'Total Assets New']];
        // Set the table rows
        var tableRows1 = tableData1.map(function (item) {
          return  [
            item.Id,
            item.EmployeeNo,
            item.AuditorName,
            item.location_name,
            item.dept_name,
            item.ScheduledStartDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null",
            item.ScheduledEndDate ? formatDate(item.ScheduledStartDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })) : "null",
            item.FoundAssetCount,
            item.MissingAssetCount,
            item.NewAssetCount
            ];
        });

  

        // Concatenate header and rows
        var csvData = tableHeader.concat(tableRows1);
  
        // Convert data to CSV string
        var csvContent = "data:text/csv;charset=utf-8," + csvData.map(row => row.join(",")).join("\n");
  
        // Create a temporary link element
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'audit_report.csv');
  
        // Simulate a click to trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: function (error) {
        console.log('At generateCSVReportRow:', error);
      }
    });
  }

