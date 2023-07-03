document.addEventListener('DOMContentLoaded', function() {

    var downloadCsvButton = document.getElementById('downloadCsvButton');
    downloadCsvButton.addEventListener('click', function() {
      window.open('http://localhost:3000/audit-report/downloadCSV');
    });

    var downloadPdfButton = document.getElementById('downloadPdfButton');
    downloadPdfButton.addEventListener('click', function() {
      window.open('http://localhost:3000/audit-report/downloadPDF');
    });
});

function sendData(event){
    event.preventDefault(); // Prevent default form submission behavior

    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    var auditNumber = document.getElementById('auditNumber').value;

    if (fromDate < toDate) {
        console.log('send function input data',{ fromDate: fromDate, toDate: toDate, auditNumber: auditNumber});
        //sendData(fromDate, toDate, auditNumber); // Call the function to send the data to the server
        $.ajax({
            url: 'http://localhost:3000/audit-report/submitData',
            type: "POST",
            data: { fromDate: fromDate, toDate: toDate, auditNumber: auditNumber },
            success: function(response){
                console.log("response", response);
                console.log('Data sent successfully');
                showAlert('Data fetched!! Click on download!!')
            },
            error: function(error){
                console.log('Error sending data', error); 
            }
        })
    } 
    else {
        showAlert("Invalid Date Range", "Please select a valid date range. The start date must be before the end date.", "warning");
    }
};

function showAlert(title, message, type) {
    var alertBox = document.createElement('div');
    alertBox.className = 'alert-box';

    var alertTitle = document.createElement('h2');
    alertTitle.className = 'alert-title';
    alertTitle.textContent = title;

    var alertMessage = document.createElement('p');
    alertMessage.className = 'alert-message';
    alertMessage.textContent = message;

    var alertIcon = document.createElement('img');
    alertIcon.className = 'alert-icon';
    alertIcon.src = './images/warning-sign.png';
    alertIcon.alt = 'Warning Icon';

    alertTitle.insertBefore(alertIcon, alertTitle.firstChild);
    alertBox.appendChild(alertTitle);
    alertBox.appendChild(alertMessage);

    var container = document.querySelector('.container');
    container.insertBefore(alertBox, container.firstChild);
  }