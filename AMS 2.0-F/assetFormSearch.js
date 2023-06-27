
let employeeField = document.getElementById('searchEmployeeField');
let assetField = document.getElementById('searchAssetField');
let startDateField = document.getElementById('searchStartDateField');
let endDateField = document.getElementById('searchEndDateField');
let locationField = document.getElementById('searchLocationField');

let assetSearchBtn = document.getElementById('assetSearchBtn');

assetSearchBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    let employeeFieldValue = employeeField.value;
    let assetFieldValue = assetField.value;
    let startDateFieldValue = startDateField.value;
    let endDateFieldValue = endDateField.value;
    let locationFieldValue = locationField.value;
    

    if(employeeFieldValue.length == 0 && assetFieldValue.length == 0 && startDateFieldValue.length == 0 && endDateFieldValue.length == 0 && locationFieldValue.length == 0){
        // ALL THE FIELDS CANNOT BE EMPTY  
        console.log(2); 
    }
    else{
        console.log(1);
        let arr = [];
        arr.push(employeeFieldValue, assetFieldValue, startDateFieldValue, endDateFieldValue, locationFieldValue);
        // console.log(arr);

        $.post(
            "http://127.0.0.1:3000/assetSearch",
            {
                dataArr : JSON.stringify(arr)
            },
            function(result){
                // let headerArr = [];
                // renderTable(headerArr, result)
            }
        )

    }
})

