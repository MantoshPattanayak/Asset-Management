// check the session variable value to see whether the page is authorized to load or not
$(document).ready(function(){
    if(sessionStorage.getItem('sessionVar') != 'pass'){
        window.location.href = `./index.html`;
    }
    else{
        let totalAssets = document.getElementById('assetsCardValue');
        let availableAssets = document.getElementById('availableAssets');
        let assetsOnMove = document.getElementById('assetsOnMove');
        let totalTags = document.getElementById('tagsCardValue');
        let availableTags = document.getElementById('assignedTags');
        let assignedTags = document.getElementById('availableTags');
        let totalReaders = document.getElementById('readersCardValue');
        let onlineReaders = document.getElementById('readersOnline');
        let offlineReaders = document.getElementById('readersOffline');

        let movementsChart = document.getElementById('movementsChart');
        let mChartSyncBtn = document.getElementById('mChartSyncBtn');
        let mStartDate = document.getElementById('mStartDate');
        let mEndDate = document.getElementById('mEndDate');
        let mSearchBtn = document.getElementById('mChartSearch');

        let alertsChart = document.getElementById('alertsChart');
        let aChartSyncBtn = document.getElementById('aChartSyncBtn');
        let aStartDate = document.getElementById('aStartDate');
        let aEndDate = document.getElementById('aEndDate');
        let aSearchBtn = document.getElementById('aChartSearch');

        let requestsTable = document.getElementById('tableBody');

        let assetsPerDeptPanel = document.getElementById('assetsPanelBody');
        let systemStats = document.getElementById('systemPanelBody');


        let mChartStatus = 0;
        let aChartStatus = 0;

        let logout = document.getElementById('logoutBtn');
        logout.addEventListener('click', ()=>{
            $.post(
                "http://127.0.0.1:3000/logout",
                {
                    userMail : sessionStorage.getItem('userMail')
                },
                function(result){
                    sessionStorage.setItem('sessionVar', null);
                    window.location.href = `./index.html`;
                }
            )
        });

        setCards();
        setMovementChart();
        setAlertChart();
        setRequestTable();
        setAssetDeptTiles();
        setSystemStats();

        setInterval(()=>{
            setCards();
        }, 3000);

        setInterval(()=>{
            if(mChartStatus == 0){
            setMovementChart();
            }
        }, 3000);

        setInterval(()=>{
            if(aChartStatus == 0){
            setAlertChart();
            }
        }, 3000);

        setInterval(()=>{
            setRequestTable();
        }, 3000);

        setInterval(()=>{
            setAssetDeptTiles();
        }, 3000);

        setInterval(()=>{
            setSystemStats();
        }, 3000);


        function setCards(){
        $.post(
            "http://127.0.0.1:3000/dashboardCards",
            {
                department: sessionStorage.getItem('userDept')
            },
            function(result){
                totalAssets.innerText = result[0];
                availableAssets.innerText = result[1];
                assetsOnMove.innerText = result[2];
                totalTags.innerText = result[3];
                availableTags.innerText = result[4];
                assignedTags.innerText = result[5];
                totalReaders.innerText = result[6];
                onlineReaders.innerText = result[7];
                offlineReaders.innerText = result[8]
            }
        ) 
        }
//  chart1.data.datasets[0].data = result[1];
        let config1 = {
            type: 'bar',
            data : {
                labels : ['Jan'],
                datasets : [{
                    backgroundColor : '#3f9dec',
                    data: [1]
                }]
            },
            options : {
                plugins : {
                    legend : {display : false}
                },
                maintainAspectRatio : false
            }
        }

        let config2 = {
            type: 'bar',
            data : {
                labels : ['Jan'],
                datasets : [{
                    backgroundColor : '#3f9dec',
                    data: [1]
                }]
            },
            options : {
                plugins : {
                    legend : {display : false}
                },
                maintainAspectRatio : false
            }
        }

        let chart1 = new Chart(movementsChart, config1);
        let chart2 = new Chart(alertsChart, config2);

        function setMovementChart(){
            $.post(
                "http://127.0.0.1:3000/movementChartData",
                {
                    department : sessionStorage.getItem('userDept')
                },
                function(result){
                    chart1.data.labels = result[0];
                    chart1.data.datasets[0].data = result[1];
                    chart1.update();
                }
            )
        }

        function setAlertChart(){
            $.post(
                "http://127.0.0.1:3000/alertsChartData",
                {
                    department : sessionStorage.getItem('userDept')
                },
                function(result){
                    chart2.data.labels = result[0];
                    chart2.data.datasets[0].data = result[1];
                    chart2.update();
                }
            )
        }

        function setRequestTable(){
            $.post(
                "http://127.0.0.1:3000/latestAssetRequests",
                {
                    department : sessionStorage.getItem('userDept')
                },
                function(result){
                    let headerArr = ['Serial no.', 'Asset ID', 'Asset name', 'Source', 'Destination', 'Time', 'Date', 'Requestor name', 'Requestor ID', 'Request Status'];
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
                    requestsTable.append(table);
                }
            )
        }

        function setAssetDeptTiles(){
            $.post(
                "http://127.0.0.1:3000/assetsPerDept",
                {
                    department : sessionStorage.getItem('userDept')
                },
                function(result){
                    let tiles = document.querySelectorAll('.tile');
                    for(let i = 0; i < tiles.length; i++){
                        tiles[i].remove();
                    }
                    let len = result[0].length;
                    for(let i = 0; i < len; i++){
                        let tile = document.createElement('div');
                        tile.className = 'tile';
                        let tileHeader = document.createElement('div');
                        tileHeader.className = 'tileName';
                        let tileValue = document.createElement('div');
                        tileValue.className = 'tileValue';
                        
                        tileHeader.innerText = result[0][i];
                        tileValue.innerText = result[1][i];

                        tile.append(tileHeader, tileValue);
                        assetsPerDeptPanel.append(tile);
                    }
                }
            )
        }

        function setSystemStats(){
            $.post(
                "http://127.0.0.1:3000/systemStatistics",
                function(result){
                    let tiles = document.querySelectorAll('.tiles');
                    for(let i = 0; i < tiles.length; i++){
                        tiles[i].remove();
                    }
                    let len = result[0].length;
                    for(let i = 0; i < len; i++){
                        let tile = document.createElement('div');
                        tile.className = 'statTiles';
                        let tileHeader = document.createElement('div');
                        tileHeader.className = 'tileName';
                        let tileValue = document.createElement('div');
                        tileValue.className = 'tileValue';
                        
                        tileHeader.innerText = result[0][i];
                        tileValue.innerText = result[1][i];

                        tile.append(tileHeader, tileValue);
                        systemStats.append(tile);
                    }
                }
            )
        }

        mChartSyncBtn.addEventListener('click',(e)=>{
            e.preventDefault();
            setMovementChart();
            mChartStatus = 0;
        });

        mSearchBtn.addEventListener('click', (req, res)=>{
            let startDate = new Date(mStartDate.value);
            let endDate = new Date(mEndDate.value);
            
            if(startDate >= endDate){
                $.post(
                    "http://127.0.0.1:3000/movementChartSearch",
                    {
                        department : sessionStorage.getItem('userDept'),
                        startDate : mStartDate.value,
                        endDate : mEndDate.value
                    },
                    function(result){
                        // console.log(result);
                        chart1.data.labels = result[0];
                        chart1.data.datasets[0].data = result[1];
                        chart1.update();
                        mChartStatus = 1;
                    }
                )
            }
            else{
                console.log('date condition mismatch');
            }
        })

        aChartSyncBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            setAlertChart();
            aChartStatus = 0;
        });

        aSearchBtn.addEventListener('click', (req, res)=>{
            let startDate = new Date(aStartDate.value);
            let endDate = new Date(aEndDate.value);

            if(startDate >= endDate){
                $.post(
                    "http://127.0.0.1:3000/alertChartSearch",
                    {
                        department : sessionStorage.getItem('userDept'),
                        startDate : startDate,
                        endDate : endDate
                    },
                    function(result){
                        chart2.data.labels = result[0];
                        chart2.data.datasets[0].data = result[1];
                        chart2.update();
                        aChartStatus = 1;
                    }
                )
            }
            else{
                console.log('date condition mismatch');
            }
        })

    }
})

//Request asset from script
let modalLaunchBtn = document.getElementById('launchRequestForm');

let modal = document.getElementById('reqFormContainer');
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

// let assetid_from_storage = JSON.parse(sessionStorage.getItem("asset_id"));

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
                "http://127.0.0.1:3000/reqAsset",
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
                "http://127.0.0.1:3000/multiReq",
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
    errMsgElement = element.parentElement.nextElementSibling;
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
    errMsgElement = element.parentElement.nextElementSibling;
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
            "http://127.0.0.1:3000/assetSuggest",
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

function suggest(result, datalist){
    // console.log(result.length);
    // let res = result.filter(e => e.toLowerCase().includes(value.toLowerCase()));
    // console.log(res)
    // for(let i = 0 ; i < len ; i++){
    //     if(((result[i].toLowerCase()).indexOf(value.toLowerCase()))>-1)
    //     {
    //         //comparing if input string is existing in tags[i] string
    //         let option = document.createElement('option');
    //         option.setAttribute('value', result[i]);
    //         datalist.append(option);
    //     }
    // }
    for(let i = 0; i < result.length; i++){
        let option = document.createElement('option');
        option.setAttribute('value', result[i]);
        datalist.append(option);
    }
}

//Additional code
assetID.addEventListener('change', ()=> {
    let value = assetID.value;
    let length = display.children.length;

    dynamicChildremove(display);

    $.post(
        "http://127.0.0.1:3000/assetNameFetch",
        {
            assetId:value
        },
        function(result){
            // console.log(display.childNodes);
            let valueArray = Object.values(result);
        if(assetID.value && valueArray.length > 0){
            for (let i = 0; i < valueArray.length; i++) {
                // console.log(valueArray[i]);
                button = document.createElement('button');
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
        currentbutton = e.target;
        currentbutton.classList.toggle('selected');
    }
})


function dynamicChildremove(element){
    let length = element.children.length;
    for(let i=0; i<length; i++){
        element.children[0].remove();
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

function append(element , data, c){
    // if(c === 1){
    //     console.log(data[12] , data[13])
    // }
    for(let i=0; i<data.length; i++){
        // console.log(result)
        option = document.createElement("option");
        option.text = data[i];
        element.appendChild(option);
    }
}

window.addEventListener("load", (e)=> {
    e.preventDefault();
    let option;
    // console.log(startingPoint)
    // console.log(destinationPoint)
    $.post(
        "http://127.0.0.1:3000/location-fetch",
        {},
        function(result){
            // for(let i=0; i<result.length; i++){
            //     // console.log(result)
            //     option = document.createElement("option");
            //     option.text = result[i];
            // }
            // console.log(option)
            let result1 = [];
            for(i = 0; i < result.length; i++){
                if(result[i].toLowerCase().includes('outside') == false){
                    result1.push(result[i]);
                }
            }
            append(startingPoint, result1 , 1);
            append(destinationPoint, result , 2);
        }
    )
    
    // $.post(
    //     "http://127.0.0.1:3000/assetSuggest",
    //     {},
    //     function(result){
    //         // console.log(result)
    //         // let res = result.map(Number)
    //         // console.log(res)
    //         sessionStorage.setItem('asset_id', JSON.stringify(result));
    //     }
    // )
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



