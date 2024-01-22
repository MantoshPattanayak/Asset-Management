// // check the session storage variable value to see whether the page is authorized to be loaded or not


// let allAlertsValue = document.getElementById('allAlerts');
// let alertsTodayValue = document.getElementById('alertsToday');
// let alertsWeeklyValue = document.getElementById('alertsWeekly');
// let alertsMonthlyValue = document.getElementById('alertsMonthly');

// let allAlertsCard = document.getElementById('allAlertsCard');
// let alertsTodayCard = document.getElementById('alertsTodayCard');
// let alertsWeeklyCard = document.getElementById('alertsWeeklyCard');
// let alertsMonthlyCard = document.getElementById('alertsMonthlyCard');

// let tableHolder = document.getElementById('tableBody');

// let alertField = document.getElementById('alertSearchField');
// let alertSearchBtn = document.getElementById('alertSearchBtn');

// let chartIndex = 0;
// let chartSyncBtn = document.getElementById('');

// setAlertCards();
// setAllAlertsTable();

// function setAlertCards(){
//     $.post(
//         "http://127.0.0.1:3000/setAlertCards",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             console.log(result);
//             allAlertsValue.innerText = result[0];
//             alertsTodayValue.innerText = result[1];
//             alertsWeeklyValue.innerText = result[2];
//             alertsMonthlyValue.innerText = result[3];
//         }
//     )
// }


// function setAllAlertsTable(){
//     $.post(
//         "http://127.0.0.1:3000/allAlerts",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             chartIndex = 1;
//             renderTable(result);
//         }
//     )
// }

// allAlertsCard.addEventListener('click', (e)=>{
//     e.preventDefault();
//     console.log(1);
//     $.post(
//         "http://127.0.0.1:3000/allAlerts",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             chartIndex = 1;
//             renderTable(result);
//         }
//     )
// })
// alertsTodayCard.addEventListener('click', (e)=>{
//     e.preventDefault();
//     console.log(2);
//     $.post(
//         "http://127.0.0.1:3000/alertsToday",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             chartIndex = 2;
//             renderTable(result);
//         }
//     )
// })
// alertsWeeklyCard.addEventListener('click', (e)=>{
//     e.preventDefault();
//     console.log(3);
//     $.post(
//         "http://127.0.0.1:3000/alertsWeekly",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             chartIndex = 3;
//             renderTable(result);
//         }
//     )
// })
// alertsMonthlyCard.addEventListener('click', (e)=>{
//     e.preventDefault();
//     console.log(4);
//     $.post(
//         "http://127.0.0.1:3000/alertsMonthly",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             chartIndex = 4;
//             renderTable(result);
//         }
//     )
// })

// alertSearchBtn.addEventListener('click', (e)=>{
//     e.preventDefault();
//     let searchTerm = alertField.value;
//     if(searchTerm.length != 0 && isNaN(searchTerm) == false){
//         $.post(
//             "http://127.0.0.1:3000/alertSearch",
//             {
//                 department : sessionStorage.getItem('userDept'),
//                 searchTerm : searchTerm
//             },
//             function(result){
//                 renderTable(result);
//             }
//         )
//     }
//     else{
//         console.log('incorrect data type');
//     }
// })


// function renderTable(result){
//     let headerArr = ['Asset ID', 'Asset name', 'Reader ID', 'Location name', 'Date', 'Time', 'Alert description'];
//             let element = document.querySelector('table');
//             element.remove();
//             let table = document.createElement('table');
//             table.className = 'table';
//             let thead = document.createElement('thead');
//             let tbody = document.createElement('tbody');
//             let tr = document.createElement('tr');

//             for(let i = 0; i < headerArr.length; i++){
//                 let th = document.createElement('th');
//                 th.innerText = headerArr[i];
//                 tr.appendChild(th);
//             }
//             for(let x in result){
//                 let row = tbody.insertRow(x);
//                 let objectLength = Object.values(result[x]).length;
//                 for(let i = 0; i < objectLength; i++){
//                     let data = Object.values(result[x])[i];
//                     if(data != null){
//                         row.insertCell(i).innerText = data;
//                     }
//                     else{
//                         row.insertCell(i).innerText = " ";
//                     }
//                 }
//             }
//             thead.append(tr);
//             table.append(thead);
//             table.append(tbody);
//             tableHolder.append(table);
// }

// ------------------------------------------------------------------------------------

// check the session variable value to see whether the page is authorized to load or not 


// let mAllRequestsCard = document.getElementById('mAllRequests');
// let mPendingRequestsCard = document.getElementById('mPendingRequests');
// let mApprovedRequestsCard = document.getElementById('mApprovedRequests');
// let mDeniedRequestsCard = document.getElementById('mDeniedRequests');

// let mAllRequests = document.getElementById('mAllRequestsValue');
// let mPendingRequests = document.getElementById('mPendingRequestsValue');
// let mApprovedRequests = document.getElementById('mApprovedRequestsValue');
// let mDeniedRequests = document.getElementById('mDeniedRequestsValue');

// let aAllRequestsCard = document.getElementById('aAllRequests');
// let aPendingRequestsCard = document.getElementById('aPendingRequests');
// let aApprovedRequestsCard = document.getElementById('aApprovedRequests');
// let aDeniedRequestsCard = document.getElementById('aDeniedRequests');

// let aAllRequests = document.getElementById('aAllRequestsValue');
// let aPendingRequests = document.getElementById('aPendingRequestsValue');
// let aApprovedRequests = document.getElementById('aApprovedRequestsValue');
// let aDeniedRequests = document.getElementById('aDeniedRequestsValue');

// let tableHolder = document.getElementById('tableBody');
// let searchField = document.getElementById('requestSearch');
// let searchBtn = document.getElementById('reqSearchBtn');

// let panelIndex = 1;
// let cardIndex = 1;

// let headerArr1 = ['Serial no.', 'Asset ID', 'Asset name', 'Starting point', 'Destination', 'Time', 'Date', 'Requestor ID', 'Requestor', 'Request status'];
// let headerArr2 = ['Serial no.', 'Applicant name', 'Applicant ID', 'Email', 'Date', 'Contact', 'Request status'];

// setRequestCards();

// function setRequestCards(){
//     console.log(1);
//     $.post(
//         "http://127.0.0.1:3000/requestCards",
//         {
//             userDept : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             console.log(result);
//             mAllRequests.innerText = result[0];
//             mPendingRequests.innerText = result[1];
//             mApprovedRequests.innerText = result[2];
//             mDeniedRequests.innerText = result[3];

//             aAllRequests.innerText = result[4];
//             aPendingRequests.innerText = result[5];
//             aApprovedRequests.innerText = result[6];
//             aDeniedRequests.innerText = result[7];
//         }
//     )
// }



// mAllRequestsCard.addEventListener('click', ()=>{
//     console.log(1);
//     panelIndex = 1;
//     cardIndex = 1;
//     searchField.setAttribute('placeholder', 'Asset ID');
//     $.post(
//         "http://127.0.0.1:3000/allMovementRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr1, result);
//         }
//     )
// });
// mPendingRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 1;
//     cardIndex = 2;
//     searchField.setAttribute('placeholder', 'Asset ID');
//     $.post(
//         "http://127.0.0.1:3000/pendingMovementRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr1, result);
//         }
//     )
// });
// mApprovedRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 1;
//     cardIndex = 3;
//     searchField.setAttribute('placeholder', 'Asset ID');
//     $.post(
//         "http://127.0.0.1:3000/approvedMovementRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr1, result);
//         }
//     )
// });
// mDeniedRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 1;
//     cardIndex = 4;
//     searchField.setAttribute('placeholder', 'Asset ID');
//     $.post(
//         "http://127.0.0.1:3000/deniedMovementRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr1, result);
//         }
//     )
// });

// aAllRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 2;
//     cardIndex = 1;
//     searchField.setAttribute('placeholder', 'Employee ID');
//     $.post(
//         "http://127.0.0.1:3000/allAccessRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr2, result);
//         }
//     )
// });
// aPendingRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 2;
//     cardIndex = 2;
//     searchField.setAttribute('placeholder', 'Employee ID');
//     $.post(
//         "http://127.0.0.1:3000/pendingAccessRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr2, result);
//         }
//     )
// });
// aApprovedRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 2;
//     cardIndex = 3;
//     searchField.setAttribute('placeholder', 'Employee ID');
//     $.post(
//         "http://127.0.0.1:3000/approvedAccessRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr2, result);
//         }
//     )
// });
// aDeniedRequestsCard.addEventListener('click', ()=>{
//     panelIndex = 2;
//     cardIndex = 4;
//     searchField.setAttribute('placeholder', 'Employee ID');
//     $.post(
//         "http://127.0.0.1:3000/deniedAccessRequests",
//         {
//             department: sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr2, result);
//         }
//     )
// });

// searchBtn.addEventListener('click', (e)=>{
//     e.preventDefault();
//     let searchTerm = searchField.value;

//     if(searchTerm.length != 0 && isNaN(searchTerm) == false){
//         $.post(
//             "http://127.0.0.1:3000/requestSearch",
//             {
//                 panelIndex : panelIndex,
//                 cardIndex : cardIndex,
//                 searchTerm : searchTerm,
//                 department : sessionStorage.getItem('userDept')
//             },
//             function(result){
//                 if(panelIndex == 1){
//                     renderTable(headerArr1, result);
//                 }
//                 else if(panelIndex == 2){
//                     renderTable(headerArr2, result);
//                 }
//             }
//         )
//     }
// });


// function renderTable(headerArr, result){
//     console.log(result);
//     let element = document.querySelector('table');
//     element.remove();
//     let table = document.createElement('table');
//     table.className = 'table';
//     let thead = document.createElement('thead');
//     let tbody = document.createElement('tbody');
//     let tr = document.createElement('tr');

//     for(let i = 0; i < headerArr.length; i++){
//         let th = document.createElement('th');
//         th.innerText = headerArr[i];
//         tr.appendChild(th);
//     }
//     for(let x in result){
//         let row = tbody.insertRow(x);
//         let objectLength = Object.values(result[x]).length;
//         for(let i = 0; i < objectLength; i++){
//             let data = Object.values(result[x])[i];
//             if(data != null){
//                 row.insertCell(i).innerText = data;
//             }
//             else{
//                 row.insertCell(i).innerText = " ";
//             }
//         }
//     }
//     thead.append(tr);
//     table.append(thead);
//     table.append(tbody);
//     tableHolder.append(table);
// }

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// let tableTitle = document.getElementById('tableName');
// let tableHolder = document.getElementById('tableBody');
// // let searchField = document.getElementById('');
// // let searchBtn = document.getElementById('');


// let headerArr = ['Asset ID', 'Asset name', 'Emp no', 'Emp name', 'location ID', 'location name'];

// setTable();

// function setTable(){
//     $.post(
//         "http://127.0.0.1:3000/allAssets",
//         {
//             department : sessionStorage.getItem('userDept')
//         },
//         function(result){
//             renderTable(headerArr, result);
//         }
//     )
// }

// function renderTable(headerArr, result){
//     console.log(result);
//     let element = document.querySelector('table');
//     element.remove();
//     let table = document.createElement('table');
//     table.className = 'table';
//     let thead = document.createElement('thead');
//     let tbody = document.createElement('tbody');
//     let tr = document.createElement('tr');

//     for(let i = 0; i < headerArr.length; i++){
//         let th = document.createElement('th');
//         th.innerText = headerArr[i];
//         tr.appendChild(th);
//     }
//     for(let x in result){
//         let row = tbody.insertRow(x);
//         let objectLength = Object.values(result[x]).length;
//         for(let i = 0; i < objectLength; i++){
//             let data = Object.values(result[x])[i];
//             if(data != null){
//                 row.insertCell(i).innerText = data;
//             }
//             else{
//                 row.insertCell(i).innerText = " ";
//             }
//         }
//     }
//     thead.append(tr);
//     table.append(thead);
//     table.append(tbody);
//     tableHolder.append(table);
// }

// // Asset Advance Search code

// let filterFormLaunch = document.getElementById('filterFormLaunch');
// let filterForm = document.getElementById('filterForm');

// let employeeField = document.getElementById('searchEmployeeField');
// let assetField = document.getElementById('searchAssetField');
// let startDateField = document.getElementById('searchStartDateField');
// let endDateField = document.getElementById('searchEndDateField');
// let locationField = document.getElementById('searchLocationField');

// let assetSearchBtn = document.getElementById('assetAdvanceSearchBtn');

// let filterFormCount = 0;


// filterFormLaunch.addEventListener('click', (e)=>{
//     e.preventDefault();
//     if(filterFormCount == 0){
//         filterForm.style.transition = `all 0.4s ease-in-out 0s`;
//         filterForm.style.top = '50%';
//         filterForm.style.left = '50%'
//         filterForm.style.transform = 'translate(-50%, -50%)';
//         filterFormCount = 1;
//     }
//     else if(filterFormCount == 1){
//         filterForm.style.transition = `all 0.4s ease-in-out 0s`;
//         filterForm.style.top = '0%';
//         filterForm.style.left = '50%';
//         filterForm.style.transform = 'translate(-50%, -110%)';
//         filterFormCount = 0;
//     }

// })



// assetSearchBtn.addEventListener('click', (e)=>{
//     e.preventDefault();

//     let employeeFieldValue = employeeField.value;
//     let assetFieldValue = assetField.value;
//     let startDateFieldValue = startDateField.value;
//     let endDateFieldValue = endDateField.value;
//     let locationFieldValue = locationField.value;
    

//     if(employeeFieldValue.length == 0 && assetFieldValue.length == 0 && startDateFieldValue.length == 0 && endDateFieldValue.length == 0 && locationFieldValue.length == 0){
//         // ALL THE FIELDS CANNOT BE EMPTY  
//         console.log(2); 
//     }
//     else{
//         console.log(1);
//         let arr = [];
//         arr.push(employeeFieldValue, assetFieldValue, startDateFieldValue, endDateFieldValue, locationFieldValue);
//         // console.log(arr);

//         $.post(
//             "http://127.0.0.1:3000/assetSearch",
//             {
//                 dataArr : JSON.stringify(arr)
//             },
//             function(result){

//                 renderTable(headerArr, result)

//             }
//         )

//     }
// })

// $('.clearfield').click(function(e){
//     e.preventDefault();
//     this.previousElementSibling.value = '';
// });