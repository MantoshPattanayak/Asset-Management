import { BACKEND_URL } from "./env.js";

$(document).ready(function(){
    if(sessionStorage.getItem('sessionVar') != 'pass'){
        window.location.href = `./index.html`;
    }
    else{
            let allAlertsValue = document.getElementById('allAlerts');
            let alertsTodayValue = document.getElementById('alertsToday');
            let alertsWeeklyValue = document.getElementById('alertsWeekly');
            let alertsMonthlyValue = document.getElementById('alertsMonthly');

            let allAlertsCard = document.getElementById('allAlertsCard');
            let alertsTodayCard = document.getElementById('alertsTodayCard');
            let alertsWeeklyCard = document.getElementById('alertsWeeklyCard');
            let alertsMonthlyCard = document.getElementById('alertsMonthlyCard');

            let tableHolder = document.getElementById('tableBody');

            let alertField = document.getElementById('alertSearchField');
            let alertSearchBtn = document.getElementById('alertSearchBtn');

            let tableIndex = 1;
            let tableStatus = 0;
            let chartSyncBtn = document.getElementById('chartSyncBtn');

            let indicator = document.querySelectorAll('.indicator');
            let indicatorLength = indicator.length;


            let logout = document.getElementById('logoutBtn');
            logout.addEventListener('click', ()=>{
                $.post(
                    BACKEND_URL+"/logout",
                    {
                        userMail : sessionStorage.getItem('userMail')
                    },
                    function(result){
                        sessionStorage.setItem('sessionVar', null);
                        window.location.href = `./index.html`;
                    }
                )
            });

            setAlertCards();
            setAllAlertsTable();

            setInterval(()=>{
                setAlertCards();
            }, 3000);

            setInterval(()=>{
                if(tableIndex == 1 && tableStatus == 0){
                    setAllAlertsTable();
                }
                else if(tableIndex == 2 && tableStatus == 0){
                    setAlertsTodayTable();
                }
                else if(tableIndex == 3 && tableStatus == 0){
                    setAlertsWeeklyTable();
                }
                else if(tableIndex == 4 && tableStatus == 0){
                    setAlertsMonthlyTable();
                }
            }, 3000);


            allAlertsCard.addEventListener('click', (e)=>{
                e.preventDefault();
                tableIndex = 1;
                tableStatus = 0;
                setAllAlertsTable();
            })
            alertsTodayCard.addEventListener('click', (e)=>{
                e.preventDefault();
                tableIndex = 2;
                tableStatus = 0;
                setAlertsTodayTable();
            })
            alertsWeeklyCard.addEventListener('click', (e)=>{
                e.preventDefault();
                tableIndex = 3;
                tableStatus = 0;
                setAlertsWeeklyTable();
            })
            alertsMonthlyCard.addEventListener('click', (e)=>{
                e.preventDefault();
                tableIndex = 4;
                tableStatus = 0;
                setAlertsMonthlyTable();
            })

            alertSearchBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                let searchTerm = alertField.value;
                if(searchTerm.length != 0 && isNaN(searchTerm) == false){
                    tableStatus = 1;
                    $.post(
                        BACKEND_URL+"/alertSearch",
                        {
                            department : sessionStorage.getItem('userDept'),
                            searchTerm : searchTerm,
                            tableIndex : tableIndex
                        },
                        function(result){
                            renderTable(result);
                        }
                    )
                }
                else{
                    console.log('incorrect data type');
                }
            })

            chartSyncBtn.addEventListener('click', (e)=>{
                tableStatus = 0;
                if(tableIndex == 1 && tableStatus == 0){
                    setAllAlertsTable();
                }
                else if(tableIndex == 2 && tableStatus == 0){
                    setAlertsTodayTable();
                }
                else if(tableIndex == 3 && tableStatus == 0){
                    setAlertsWeeklyTable();
                }
                else if(tableIndex == 4 && tableStatus == 0){
                    setAlertsMonthlyTable();
                }
            })


            function setAlertCards(){
                $.post(
                    BACKEND_URL+"/setAlertCards",
                    {
                        department : sessionStorage.getItem('userDept')
                    },
                    function(result){
                        allAlertsValue.innerText = result[0];
                        alertsTodayValue.innerText = result[1];
                        alertsWeeklyValue.innerText = result[2];
                        alertsMonthlyValue.innerText = result[3];
                    }
                )
            }

            function setAllAlertsTable(){
                for(let i = 0; i < indicatorLength; i++){
                    if(indicator[i].id == 'indicator1'){
                        indicator[i].style.visibility = 'visible';
                    }
                    else{
                        indicator[i].style.visibility = 'hidden';
                    }
                }
                $.post(
                    BACKEND_URL+"/allAlerts",
                    {
                        department : sessionStorage.getItem('userDept')
                    },
                    function(result){
                        tableIndex = 1;
                        renderTable(result);
                    }
                )
            }

            function setAlertsTodayTable(){
                for(let i = 0; i < indicatorLength; i++){
                    if(indicator[i].id == 'indicator2'){
                        indicator[i].style.visibility = 'visible';
                    }
                    else{
                        indicator[i].style.visibility = 'hidden';
                    }
                }
                $.post(
                    BACKEND_URL+"/alertsToday",
                    {
                        department : sessionStorage.getItem('userDept')
                    },
                    function(result){
                        tableIndex = 2;
                        renderTable(result);
                    }
                )
            }

            function setAlertsWeeklyTable(){
                for(let i = 0; i < indicatorLength; i++){
                    if(indicator[i].id == 'indicator3'){
                        indicator[i].style.visibility = 'visible';
                    }
                    else{
                        indicator[i].style.visibility = 'hidden';
                    }
                }
                $.post(
                    BACKEND_URL+"/alertsWeekly",
                    {
                        department : sessionStorage.getItem('userDept')
                    },
                    function(result){
                        tableIndex = 3;
                        renderTable(result);
                    }
                )
            }

            function setAlertsMonthlyTable(){
                for(let i = 0; i < indicatorLength; i++){
                    if(indicator[i].id == 'indicator4'){
                        indicator[i].style.visibility = 'visible';
                    }
                    else{
                        indicator[i].style.visibility = 'hidden';
                    }
                }
                $.post(
                    BACKEND_URL+"/alertsMonthly",
                    {
                        department : sessionStorage.getItem('userDept')
                    },
                    function(result){
                        tableIndex = 4;
                        renderTable(result);
                    }
                )
            }

            function renderTable(result){
                let headerArr = ['Asset ID', 'Asset name', 'Reader ID', 'Location name', 'Date', 'Time', 'Alert description'];
                let element = document.querySelector('table');
                element.remove();
                let table = document.createElement('table');
                table.className = 'table';
                let thead = document.createElement('thead');
                let tbody = document.createElement('tbody');
                let tr = document.createElement('tr');

                for(let i = 0; i < headerArr.length; i++){
                    let th = document.createElement('th');
                    th.innerText = headerArr[i];
                    tr.appendChild(th);
                }
                for(let x in result){
                    let row = tbody.insertRow(x);
                    let objectLength = Object.values(result[x]).length;
                    for(let i = 0; i < objectLength; i++){
                        let data = Object.values(result[x])[i];
                        if(data != null){
                            row.insertCell(i).innerText = data;
                        }
                        else{
                            row.insertCell(i).innerText = " ";
                        }
                    }
                }
                thead.append(tr);
                table.append(thead);
                table.append(tbody);
                tableHolder.append(table);
            }
    }
})

//Request asset from script
let modalLaunchBtn = document.getElementById('launchRequestForm');

let modal = document.getElementById('reqFormContainer');
let closeReqForm = document.getElementsByClassName('reqFormClose')[0];
// let closeModal = document.getElementById('');
let formFront = document.getElementById('reqFormFront');
// console.log(formFront);
let formBack = document.getElementById('reqFormBack');
// console.log(formBack);
let formSlider = document.getElementById('reqFormSlider');
let showSingleAssetForm = document.getElementById('singleReqBtn');
let showMultiAssetForm = document.getElementById('multiReqBtn');
let singleAssetForm = document.getElementById('singleReqForm');
let multiAssetForm = document.getElementById('multiReqForm');

let reqName = document.getElementById('reqName');
let reqID = document.getElementById('reqID');
let reqDept = document.getElementById('empDept');
let assetID = document.getElementById('assetID');

let assetForm = document.getElementById('assetForm');
let assetFormFront = document.getElementById('reqFormFront');
// console.log(assetFormFront)
let assetFormBack = document.getElementById('reqFormBack');
// console.log(assetFormBack)
let submitAssetForm = document.getElementById('submitAssetForm');

let startingPoint = document.getElementById('source');
let destinationPoint = document.getElementById('destination');
let singleReqFormSubmitBtn = document.getElementById('submitSingleReqForm');

//display element
let display = document.getElementById('display');

let file = document.getElementById('uploadFile');
let uploadFileBtn = document.getElementById('submitMultiReqForm');

let formSliderCounter = 0;
let modalLaunchCounter = 0;
let contactModalCounter = 0;
let assetModalCounter = 0;
let formResponseCounter = 0;
let formCounter = 0;

showSingleAssetForm.addEventListener('click', (e)=>{
    e.preventDefault();
    formSlider.style.transform = `translate(0px)`;
})
showMultiAssetForm.addEventListener('click', (e)=>{
    e.preventDefault();
    formSlider.style.transform = `translate(-700px)`;
})

$('.clearfield').click(function(e){
    e.preventDefault();
    this.previousElementSibling.value = '';
});

$('.closeformModal').click(function(e){
    e.preventDefault();
    // console.log('hey');
    let element = this.parentElement;
    element.style.top = '0%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -110%)';
})

$('.closeModal').click(function(e){
    e.preventDefault();
    let element = this.parentElement.parentElement;
    element.style.top = '0%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -110%)';
})

singleReqFormSubmitBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    //input values
    let reqNameValue = reqName.value;
    let reqIDValue = reqID.value;
    let reqDeptValue = reqDept.value;
    let assetIDValue = assetID.value;
    let startingPointValue = startingPoint.value;
    let destinationPointValue = destinationPoint.value;

    //display value asset name
    let children = display.children

    //For asset Name
    let asset_name = [];
    //Updating asset name
    for (let i=0 ; i<children.length; i++) {
        // console.log(children[i]);
        if(children[i].classList.contains('selected')) {
            // console.log(children[i].innerText);
            let name = children[i].innerText;
            // let name = children[i].value;
            // console.log(name);
            asset_name.push(name);
        }
    }

    let inputState1 = inputCheck(reqName, reqNameValue, 'string');
    let inputState2 = inputCheck(reqID, reqIDValue, 'number');
    let inputState3 = inputCheck(reqDept, reqDeptValue,'string');
    let inputState4 = inputCheck(assetID, assetIDValue, 'number');
    let inputState5 = inputCheck(startingPoint, startingPointValue, 'string');
    let inputState6 = inputCheck(destinationPoint, destinationPointValue, 'string');
    //check if the asset name array is blank or not
    // let lengthState = len_check(asset_name.length);
    let assetNameState = assetName_Check(asset_name, display);


    if(inputState1 && inputState2 && inputState3 && inputState4 && inputState5 && inputState6 && assetNameState){
        if(startingPointValue.trim().toUpperCase() != destinationPointValue.trim().toUpperCase()){
            $.post(
                BACKEND_URL+"/reqAsset",
                {
                    reqName : reqNameValue,
                    reqID : reqIDValue,
                    assetID : assetIDValue,
                    // assetName : assetName,
                    assetName : asset_name, 
                    // name:{assetName: asset_name},
                    assetDept : reqDeptValue,
                    source : startingPointValue,
                    destination : destinationPointValue
                },
                function(result){
                // console.log(result.state)
                // console.log(result.res)
                let icon = assetFormBack.querySelector('.responseIcon');
                let responseTitle = assetFormBack.querySelector('.responseTitle');
                let responseMsg = assetFormBack.querySelector('.responseMsg');
                dynamicChildremove(responseMsg);
                // if(parseInt(result.state) == 1){
                if(result.state == 1){
                    // query failure
                    // console.log("ok")
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request received';
                    // responseMsg.innerText = result[1];
                    
                    assetFormBack.style.backgroundColor = '#A6DBCB';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';

                    for(let i=0 ; i< result.res.length ; i++){
                        let msg = document.createElement("div");
                        msg.innerText = result.res[i]
                        responseMsg.appendChild(msg);
                        // console.log(result.res[i])
                    }
                }
                else if(result.state == 2){
                    // condition not satisfied
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request Denied';
                    // responseMsg.innerText = result[1];
                    assetFormBack.style.backgroundColor = '#f76045';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';

                    for(let i=0 ; i< result.res.length ; i++){
                        let msg = document.createElement("div");
                        msg.innerText = result.res[i]
                        responseMsg.appendChild(msg);
                        // console.log(result.res[i])
                    }
                }
                else if(parseInt(result) == 3){
                    // auxillery message for condition not satisfied
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request denied';
                    responseMsg.innerText = 'Asset alread present at the destination'
                    assetFormBack.style.backgroundColor = '#f76045';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
                else{
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Request Denied';
                    responseMsg.innerText = 'Unknown error'
                    assetFormBack.style.backgroundColor = '#A6DBCB';
                    assetFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    assetFormFront.style.transition = 'transform 0.6s linear';
                    assetFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    assetFormBack.style.transition = 'transform 0.6s linear';
                }
                }
            )
        }
        else{
            // start and end points are same
            let element1 = startingPoint.parentElement.nextElementSibling;
            let element2 = destinationPoint.parentElement.nextElementSibling;
            element1.innerText = `Value cannot be same`;
            element2.innerText = `Value cannot be same`;
            element1.style.visibility = `visible`;
            element2.style.visibility = `visible`;
        }
    }
    else{
        // inputState else
    }
})


//  submit bulk request 

uploadFileBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    // console.log('100');

    let username = sessionStorage.getItem('userName');
    let userId = sessionStorage.getItem('userID');
    let userDept = sessionStorage.getItem('userDept');

    // console.log(username);

    let fr = new FileReader();
    if(file.files.length > 0){
        // console.log(200);
        fr.readAsText(file.files[0]);
        fr.onload = function(){
            let data = fr.result.split(/\r?\n|\r/);
            // console.log(data);
            $.post(
                BACKEND_URL+"/multiReq",
                {
                    reqName : username,
                    reqID : userId,
                    reqDept : userDept,
                    data :JSON.stringify(data)
                },
                function(result){
                    console.log(result);
                    let fileResponse = document.getElementById('fileResponse');
                    
                    let childrenList = fileResponse.children.length;
                    for(let i = 0; i < childrenList; i++){
                        fileResponse.children[0].remove();
                    }

                    if(typeof(result)== 'string'){
                        let div = document.createElement('div');
                        console.log("hi there")
                        // div.innerText = 'Cannot send request due to duplicate asset id values';
                        div.innerText = result;
                        
                        fileResponse.append(div);
                    }
                    else if(typeof(result) == 'object'){
                        console.log('Object');
                        console.log(result);
                        renderError(result, fileResponse);
                    }
                    else{
                        console.log('unknown');
                    }
                }
            )
        }
    }
    else{
        // user has not selected any files
    }
})
function inputCheck(element, elementValue, type){
    let errMsgElement = element.parentElement.nextElementSibling;
    if(elementValue.trim() == 0){
        // message to be shown if the field is 0
        let errMsg = `Field cannot be empty`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';
        return 0;
    }  
    else if(typeCheck(elementValue, type) == 0){
        // message to be shown if the type doesnt match
        let errMsg = `Field has to be a ${type}`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';
        return 0;
    }
    else{
        let errMsg = `Error Message`;
        errMsgElement.value = errMsg;
        errMsgElement.style.visibility = 'hidden';
        return 1;
    }
}

function typeCheck(elementValue, type){
    if(type == 'string' && isNaN(elementValue) == false){
        return 0;
    }
    else if(type == 'number' && isNaN(elementValue) == true){
        return 0;
    }
    else{
        return 1;
    }
}

function assetName_Check(names,element){
   let errMsgElement = element.parentElement.nextElementSibling;
    if(names.length === 0){
        let errMsg = "Please Select assets"
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';
        return 0;
    }
    
    else {
        let errMsg = "Error Message";
        errMsgElement.value = errMsg;
        errMsgElement.style.visibility = 'hidden';
        return 1;    
    }
}

//Debouncer
const updateDebounceText = debounce((text)=> {
    // console.log(text);
    let datalist = document.getElementById('assetIDList');
    let dept = reqDept.value;
    dynamicChildremove(datalist);
    if(assetID.value.length === 0){
        let display_message = "<span>Asset Name Display</span>"
        display.innerHTML = display_message; 
    } else {
        // console.log(202)
        $.post(
            BACKEND_URL+"/assetSuggest",
            {
                value : text,
                dept : dept
            },
            function(result){
            // console.log(result);
            suggest(result, datalist);
        }
    )
    }
  })

  assetID.addEventListener('input',(e)=>{
    let value = assetID.value;
    let datalist = document.getElementById('assetIDList');
    let dept = reqDept.value;
    dynamicChildremove(datalist);
    updateDebounceText(e.target.value);

    // if(assetID.value.length === 0){
    //     let display_message = "<span>Asset Name Display</span>"
    //     display.innerHTML = display_message; 
    // } else {
    //     // console.log(202)
    //     $.post(
    //         "http://127.0.0.1:3000/assetSuggest",
    //         {
    //             value : value,
    //             dept : dept
    //         },
    //         function(result){
    //         // console.log(result);
    //         suggest(result, datalist);
    //     }
    // )
    // }
})

//Debounce Delayer
function debounce(cb , delay = 500) {
    let timeout;
    
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

//Additional code
assetID.addEventListener('change', ()=> {
    let value = assetID.value;
    let length = display.children.length;

    dynamicChildremove(display);

    $.post(
        BACKEND_URL+"/assetNameFetch",
        {
            assetId:value
        },
        function(result){
            // console.log(display.childNodes);
            let valueArray = Object.values(result);
        if(assetID.value && valueArray.length > 0){
            for (let i = 0; i < valueArray.length; i++) {
                // console.log(valueArray[i]);
                let button = document.createElement('button');
                button.classList.add('active');
                button.textContent = valueArray[i];
                display.appendChild(button);
            }
        } else {
            let display_message = "<span>Asset Name Display</span>"
            display.innerHTML = display_message;
        }
        }
    )
})

display.addEventListener('click',(e) => {
    e.preventDefault();
    if(e.target && e.target.nodeName == 'BUTTON'){
        // console.log(e.target)
        // e.target.remove();
       let currentbutton = e.target;
        currentbutton.classList.toggle('selected');
    }
})


function dynamicChildremove(element){
    let length = element.children.length;
    for(let i=0; i<length; i++){
        element.children[0].remove();
    }
}

function suggest(result, datalist){
    // console.log(result.length);
    // let result1 = ['tiger','tigon', 'zebra', 'girraffe', 'pangolin', 'lion']
    for(let i = 0; i < result.length; i++){
        let option = document.createElement('option');
        option.setAttribute('value', result[i]);
        datalist.append(option);
    }
}
function renderError(result, fileResponse){
    let divList;
    console.log(result)
    let length = result.length;
    for(let i = 0; i < length; i++){
        let div = document.createElement('div');
        div.innerText = result[i];
        fileResponse.append(div);
        // console.log(fileResponse);
    }
}

function append(element , data){
    
    for(let i=0; i<data.length; i++){
        // console.log(result)
        let option = document.createElement("option");
        option.text = data[i];
        element.appendChild(option);
    }
}

window.addEventListener("load", (e)=> {
    e.preventDefault();
    let option;
    $.post(
        BACKEND_URL+"/location-fetch",
        {},
        function(result){
            // for(let i=0; i<result.length; i++){
            //     // console.log(result)
            //     option = document.createElement("option");
            //     option.text = result[i];
            // }
            // console.log(option)
            append(startingPoint, result);
            append(destinationPoint, result);
        }
    )
})

// let startingPoint = document.getElementById('source');
// let destinationPoint = document.getElementById('destination');
// let assetID = document.getElementById('assetID');
// let display = document.getElementById('display');

// let display_message = "<span>Asset Name Display</span>"
// display.innerHTML = display_message;

modalLaunchBtn.addEventListener('click', (e)=>{
    // console.log(1);
    e.preventDefault();
    let option;
    reqName.value = sessionStorage.getItem('userName');
    reqID.value = sessionStorage.getItem('userID');
    reqDept.value = sessionStorage.getItem('userDept');
    reqName.readOnly = true;
    reqID.readOnly = true;
    reqDept.readOnly = true;
    reqName.style.backgroundColor = '#afb5bd';
    reqID.style.backgroundColor = '#afb5bd';
    reqDept.style.backgroundColor = '#afb5bd';

    assetID.value = ""; //Asset ID clear
    dynamicChildremove(display); //Clearing asset name display
    let display_message = "<span>Asset Name Display</span>" 
    display.innerHTML = display_message; //re-entering display message
    startingPoint.selectedIndex = 0;
    destinationPoint.selectedIndex = 0;
    
    if(modalLaunchCounter == 0){
        formFront.style.transform = 'perspective(600px) rotateY(0deg)';
        formFront.style.transitiion = 'none';
        formBack.style.transform = 'perspective(600px) rotateY(180deg)';
        formBack.style.transitiion = 'none';
        modal.style.transition = `all 0.4s ease-in-out 0s`;
        modal.style.top = `50%`;
        modal.style.transform = `translate(-50%, -50%)`;
        modalLaunchCounter = 1;
        console.log(1)
    }
    else if(modalLaunchCounter == 1){
        modal.style.top = `0%`;
        modal.style.transition = `all 0.4s ease-in-out 0s`;
        modal.style.transform = `translate(-50%, -110%)`;
        modalLaunchCounter = 0;
        // console.log(2)
    }
})


//to close request asset form
closeReqForm.addEventListener('click', (e) => {
    e.preventDefault();

    modal.style.top = `0%`;
    modal.style.transition = `all 0.4s ease-in-out 0s`;
    modal.style.transform = `translate(-50%, -110%)`;
    modalLaunchCounter = 0;
    console.log(3);
})