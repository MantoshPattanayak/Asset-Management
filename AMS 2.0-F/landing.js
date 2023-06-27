sessionStorage.setItem('sessionVar', null);

// access application form
let appName = document.getElementById('appName');
let appID = document.getElementById('appID');
let appEmail = document.getElementById('appEmail');
let appContact = document.getElementById('appContact');

// let login form 

let userEmail = document.getElementById('userEmail');
let userPass = document.getElementById('userPass');

// asset request form

let firstName = document.getElementById('firstName');
let middleName = document.getElementById('middleName');
let lastName = document.getElementById('lastName');
let email = document.getElementById('email');
let password = document.getElementById('password');
let empId = document.getElementById('empId');
let parental = document.getElementById('parental');
let department = document.getElementById('department');
let contact = document.getElementById('contact');
let address = document.getElementById('address');

// let reqID = document.getElementById('reqID');
// let assetID = document.getElementById('assetID');
// let assetDept = document.getElementById('assetDept');
// let source = document.getElementById('source');
// let destination = document.getElementById('destination');

// contact form 

let visitorName = document.getElementById('visitorName');
let visitorID = document.getElementById('visitorID');
let visitorMsg = document.getElementById('visitorMsg');

// form elements 
let formSlider = document.getElementById('formSlider');
let accessForm = document.getElementById('accessForm');
let loginForm = document.getElementById('loginForm');
let assetForm = document.getElementById('assetForm');
let assetFormFront = document.getElementById('assetFormFront');
let assetFormBack = document.getElementById('assetFormBack');
let contactForm = document.getElementById('contactForm');
let contactFormFront = document.getElementById('contactFormFront');
let contactFormBack = document.getElementById('contactFormBack');
let formResponse = document.getElementById('formResponse');
let modal = document.querySelectorAll('.modal');
let modal2 = document.querySelectorAll('.modal2');


// form submit elements 

let submitAccssForm = document.getElementById('submitAccessForm');
let submitLoginForm = document.getElementById('submitLoginForm');
let submitAssetForm = document.getElementById('submitAssetForm');
let submitContactForm = document.getElementById('submitContactForm');

// form launch elements

let launchContactForm = document.getElementById('launchContactForm');
let launchRequestForm = document.getElementById('launchRequestForm');
let showReqForm = document.getElementById('showReqBtn');
let showLoginForm = document.getElementById('showLoginBtn');

// counters 

let contactModalCounter = 0;
let assetModalCounter = 0;
let formResponseCounter = 0;
let formSliderCounter = 0;
let formCounter = 0;

// UI change 

let toggleBtn = document.getElementById('switch');

showReqForm.addEventListener('click',(e)=>{
    e.preventDefault();
    if(formCounter != 0){
        formCounter = 0;
        formSlider.style.transform = `translate(` + (-formCounter * 500) +`px)`;
    }
})
showLoginForm.addEventListener('click',(e)=>{
    e.preventDefault();
    if(formCounter != 1){
        formCounter = 1;
        formSlider.style.transform = `translate(` + (-formCounter * 500) +`px)`;
    }
})

// submit AccessForm 

submitAccssForm.addEventListener('click', (e)=>{
    e.preventDefault();
    appNameValue = appName.value;
    appIDValue = appID.value;
    appEmailValue = appEmail.value;
    appContactValue = appContact.value;

    let inputState1 = inputCheck(appName, appNameValue, 'string');
    let inputState2 = inputCheck(appID, appIDValue, 'number');
    let inputState3 = inputCheck(appEmail, appEmailValue, 'string');
    let inputState4 = inputCheck(appContact, appContactValue, 'number');

    if(inputState1 && inputState2 && inputState3 && inputState4 && appContactValue.toString().length <= 10){
        $.post(
            "http://127.0.0.1:3000/reqAccess",
            {
                appName : appNameValue,
                appID : appIDValue,
                appEmail : appEmailValue,
                appContact : appContactValue
            },
            function(result){
                let icon = formResponse.querySelector('i.responseIcon');
                let responseTitle = formResponse.querySelector('.responseTitle');
                let responseMsg = formResponse.querySelector('.responseMsg');
                if(parseInt(result[0])==1){
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-smile responseIcon';
                    responseTitle.innerText = 'Request Received';
                    responseMsg.innerText = result[1];
                    formResponse.style.backgroundColor = '#A6DBCB';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
                else if(parseInt(result[0]) == 0){
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-sad responseIcon';
                    responseTitle.innerText = 'Access Denied';
                    responseMsg.innerText = result[1];
                    formResponse.style.backgroundColor = '#e79b9b';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
            }
        )
    }
    else if(appContactValue.toString().length > 10){           
        // let icon = formResponse.querySelector('i.responseIcon');
        // let responseTitle = formResponse.querySelector('.responseTitle');
        // let responseMsg = formResponse.querySelector('.responseMsg');
        // icon.classList.remove('bx');
        // icon.classList.remove('bx-smile');
        // icon.className = 'bx bx-sad responseIcon';
        // responseTitle.innerText = 'Access Denied';
        // responseMsg.innerText = 'Phone number cannot be more than 10 digits';
        // formResponse.style.backgroundColor = '#e79b9b';
        // formResponse.style.transition = 'all 0.4s ease-in-out 0s';
        // formResponse.style.top = '50%';
        // formResponse.style.transform = 'translate(-50%, -50%)';

        let errMsgElement = appContact.parentElement.nextElementSibling;
        let errMsg = `Contact cannot be more than 10 digits`;
        errMsgElement.innerText = errMsg;
        errMsgElement.style.visibility = 'visible';

    }
}); // end of access form

// submit login form 

submitLoginForm.addEventListener('click', (e)=>{
    e.preventDefault();
    let userEmailValue = userEmail.value;
    let userPassValue = userPass.value;

    let inputState1 = inputCheck(userEmail, userEmailValue);
    let inputState2 = inputCheck(userPass, userPassValue);

    if(inputState1 && inputState2){
        $.post(
            "http://127.0.0.1:3000/login",
            {
                userEmail : userEmailValue,
                userPass : userPassValue
            },
            function(result){
                // console.log(parseInt(result[0]));

                if(parseInt(result[0]) == 2){
                    // console.log('hey there');
                }


                if(parseInt(result[0]) == 1){
                    // console.log(result);
                    sessionStorage.setItem('userMail', userEmailValue);
                    sessionStorage.setItem('sessionVar', 'pass');
                    // sessionStorage.setItem('userDept', result[3]);
                    sessionStorage.setItem('userName', result[1]);
                    sessionStorage.setItem('userID', result[2]);
                    sessionStorage.setItem('userDept', result[3]);
                    window.location.href = `./dashboard.html`;
                    // console.log('logged in');
                    // console.log(sessionStorage.getItem('userDept'));
                }
                else if(parseInt(result[0]) == 2){
                    // console.log(result[0]);
                    sessionStorage.setItem('sessionVar', 'userPass');
                    sessionStorage.setItem('userName', result[1]);
                    sessionStorage.setItem('userID', result[2]);
                    sessionStorage.setItem('userDept', result[3]);
                    window.location.href = `./userDash.html`;
                }
                else if(parseInt(result[0]) == 0){
                    let icon = formResponse.querySelector('i.responseIcon');
                    let responseTitle = formResponse.querySelector('.responseTitle');
                    let responseMsg = formResponse.querySelector('.responseMsg');
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-smile');
                    icon.className = 'bx bx-smile responseIcon';
                    responseTitle.innerText = 'Access Denied';
                    responseMsg.innerText = 'Kindly check your credentials';
                    formResponse.style.backgroundColor = '#e79b9b';
                    formResponse.style.transition = 'all 0.4s ease-in-out 0s';
                    formResponse.style.top = '50%';
                    formResponse.style.transform = 'translate(-50%, -50%)';
                }
            }
        )
    }
});

// submit asset form

fetch('http://localhost:3000/d')
.then(res => res.json())
.then(data => {

    // const { message,answer} = data
    
    // const option = document.createElement('option')
    // const option1 = document.createElement('option')
    // option.innerText = message
    // option1.innerText = answer
    let option = []
    let option1 = []

    const {message,answer}=data
    console.log(data)
    console.log(message)
    for(let i=0;i<answer.length;i++){
        // document.querySelector('#parental').append(option.push(message[i].Parent_org));
        // document.querySelector('#department').append( option1.push(message[i].dept_name));
        document.querySelector('#parental').append(new Option(answer[i].Parent_org, answer[i].Parent_org, false, false));
        
    }
    for(let i=0;i<message.length;i++){

    document.querySelector('#department').append(new Option(message[i].dept_name, message[i].dept_name, false, false));

}
    //append(new Option('KIIT', 'KIIT', false, false))
    //  console.log(option);
    //  console.log(option1)
    // document.querySelector('#parental').append(option)
    // document.querySelector('#department').append(option1)
})
.catch(err => console.error(err))
// Function to reset the form fields
function resetForm() {
    firstName.value = '';
    middleName.value = '';
    lastName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    empId.value = '';
    $('#parental')[0].selectedIndex = 0;       //parental.value = '';
    // $('#department')[0].selectedIndex=0;                //department.value = '';
    // contact.value = '';
    // address.value = '';
  }
  
  // Event handler for the submit button
  $('#submitAssetForm').click(function(e) {
    e.preventDefault();
  
    // Get input field values
    let firstNameValue = firstName.value;
    let middleNameValue = middleName.value;
    let lastNameValue = lastName.value;
    let emailValue = email.value;
    let passwordValue = password.value;
    let empIdValue = empId.value;
    let parentalValue = parental.value;
    // let departmentValue = department.value;
    // let contactValue = contact.value;
     // Get confirm password value
  let confirmPasswordValue = confirmPassword.value;
    // let addressValue = address.value;
  
    // Validate input fields
    if (!firstNameValue || !lastNameValue || !emailValue || !passwordValue || !empIdValue || !confirmPasswordValue || !parentalValue) {
      alert('Please fill in all required fields.');
      return;
    }
      // Validate input fields
      var nameRegex = /^[a-zA-Z]+$/;
      if (!firstNameValue.match(nameRegex) || !lastNameValue.match(nameRegex)) {
          alert(
              "Please enter a valid first and last name. Only letters are allowed."
          );
          return;
      }

      if (middleNameValue && !middleNameValue.match(nameRegex)) {
          alert("Please enter a valid middle name. Only letters are allowed.");
          return;
      }
  
    // Validate email format
    var emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (!emailValue.match(emailRegex)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // Validate password
  var passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
  if (!passwordValue.match(passwordRegex)) {
       alert('Password must contain at least one uppercase letter, one lowercase letter, one special character, one number, and be at least 6 characters long.');
      return;
}
     // Validate confirm password
  if (passwordValue !== confirmPasswordValue) {
    alert('Passwords do not match.');
    return;
  }
  
    // Validate empid format
    var empIdRegex = /^\d{6}$/;
    if (!empIdValue.match(empIdRegex)) {
      alert('Employee ID must be a 6-digit number.');
      return;
    }
  
    // Validate contact number format
    // var contactRegex = /^[1-9]\d{9}$/;
    // if (!contactValue.match(contactRegex)) {
    //   alert('Contact number must be a 10-digit number.');
    //   return;
    // }
  
    // Set the URL and request method
    var url = 'http://localhost:3000/done'; // Replace with your server-side script URL
    var method = 'POST'; // Replace with the desired request method
  
    // Send the form data using AJAX
    $.ajax({
      url: url,
      type: method,
      data: {
        fname: firstNameValue,
        mname: middleNameValue,
        lname: lastNameValue,
        email: emailValue,
        password: passwordValue,
        confirmPassword:confirmPasswordValue,
        parental: parentalValue,
        // department: departmentValue,
        // contact: contactValue,


        // address: addressValue,
        empid: empIdValue
      },
      success: function(response) {
        // Handle the successful response

        if(response.code == "Employee_Doesn't_exist"){
            alert(response.response);
            console.log(response.response);
        }
        else{
            alert(response.response);
            console.log(response.response);
             // Clear all fields
             resetForm();
        }
       
  
       
      },
      error: function(xhr, status, error) {
        // Handle the error response
        console.log(error);
      }
    });
  });
  
  // Event handler for cancel button or re-clicking the submit button
  $('.closeModal').click(function(e) {
    e.preventDefault();
  
    // Ask for confirmation before resetting the form
    // var confirmation = confirm('Are you sure you want to reset/close the form?');
    // if (!confirmation) {
    //   resetForm();
    // }
  });
  

 



// submit Contact Form

submitContactForm.addEventListener('click', (e)=>{
    e.preventDefault();
    let visitorNameValue = visitorName.value;
    let visitorIDValue = visitorID.value;
    let visitorMsgValue = visitorMsg.value;

    let inputState1 = inputCheck(visitorName, visitorNameValue, 'string');
    let inputState2 = inputCheck(visitorID, visitorIDValue, 'number');
    let inputState3 = inputCheck(visitorMsg, visitorMsgValue, 'string');

    if(inputState1 && inputState2 && inputState3){
        $.post(
            "http://127.0.0.1:3000/contactUs",
            {
                visitorName : visitorNameValue,
                visitorID : visitorIDValue,
                visitorMsg : visitorMsgValue
            },
            function(result){
                // console.log('Result from server :' + parseInt(result));
                if(parseInt(result) == 1){
                    let icon = contactFormBack.querySelector('.responseIcon');
                    let responseTitle = contactFormBack.querySelector('.responseTitle');
                    let responseMsg = contactFormBack.querySelector('.responseMsg');
                    icon.classList.remove('bx');
                    icon.classList.remove('bx-sad');
                    icon.className = 'bx bx-party responseIcon';
                    responseTitle.innerText = 'Query sent';
                    responseMsg.innerText = 'kindly check your mail'
                    contactFormBack.style.backgroundColor = '#A6DBCB';
                    contactFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                    contactFormFront.style.transition = 'transform 0.6s linear';
                    contactFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                    contactFormBack.style.transition = 'transform 0.6s linear';
                }
                else if(parseInt(result) == 0){
                    let icon = contactFormBack.querySelector('.responseIcon');
                    let responseTitle = contactFormBack.querySelector('.responseTitle');
                    let responseMsg = contactFormBack.querySelector('.responseMsg');
                    icon.classList.remove('bx');
                        icon.classList.remove('bx-party');
                        icon.className = 'bx bx-sad responseIcon';
                        responseTitle.innerText = 'Access Denied';
                        responseMsg.innerText = 'kindly check your credentials'
                        contactFormBack.style.backgroundColor = '#e79b9b';
                        contactFormFront.style.transform = 'perspective(600px) rotateY(-180deg)';
                        contactFormFront.style.transition = 'transform 0.6s linear';
                        contactFormBack.style.transform = 'perspective(600px) rotateY(0deg)';
                        contactFormBack.style.transition = 'transform 0.6s linear';
                }
            }
        )
    }
});

$('.clearfield').click(function(e){
    e.preventDefault();
    this.previousElementSibling.value = '';
});

$('.closeformModal').click(function(e){
    e.preventDefault();
    let element = this.parentElement;
    // console.log(1);
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
    // resetForm();
})

function inputCheck(element, elementValue, type){
    // console.log(type);
    errMsgElement = element.parentElement.nextElementSibling;
    // console.log(errMsgElement);
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

// function typeCheck(elementValue, type){
//     if(type == 'string' && Number.isInteger(elementValue) == true){
//         return 0;
//     }
//     else if(type == 'number' && Number.isInteger(elementValue) == false){
//         return 0;
//     }
//     else{
//         return 1;
//     }
// }

function typeCheck(elementValue, type){
    if(type == 'string' && isNaN(elementValue) == false){
        return 0;
    }
    else if(type == 'number' && isNaN(elementValue) == true){
        return 0;
    }
    else{
        // console.log('returned 1');
        return 1;
    }
}





// toggleBtn.addEventListener('change', function(){
//     if(this.checked){

//     }
//     else{

//     }
// })

launchContactForm.addEventListener('click',(e)=>{
    e.preventDefault();
    
   for(let i = 0; i < modal2.length; i++){
        if(modal2[i].id != contactForm.id){
            modal2[i].style.top = `0%`;
            modal2[i].style.transform = `translate(-50%, -110%)`;
            assetModalCounter = 0;
        }
    }
    if(contactModalCounter == 0){
        contactFormFront.style.transform = 'perspective(600px) rotateY(0deg)';
        contactFormFront.style.transition = 'transform 0.6s linear';
        contactFormBack.style.transform = 'perspective(600px) rotateY(-180deg)';
        contactFormBack.style.transition = 'transform 0.6s linear';
        contactForm.style.top = `50%`;
        contactForm.style.transition = `all 0.4s ease-in-out 0s`;
        contactForm.style.transform = `translate(-50%, -50%)`;
        contactModalCounter = 1;
    }
    else if(contactModalCounter == 1){
        contactForm.style.top = `0%`;
        contactForm.style.transition = `all 0.4s ease-in-out 0s`;
        contactForm.style.transform = `translate(-50%, -110%)`;
        contactModalCounter = 0;
    }
})
launchRequestForm.addEventListener('click', (e)=>{
    e.preventDefault();
    console.log(1);
    for(let i = 0; i < modal.length; i++){
        if(modal[i].id != assetForm.id){
            modal[i].style.top = `0%`;
            modal[i].style.transform = `translate(-50%, -110%)`;
            contactModalCounter = 0;
        }
    }
    if(assetModalCounter == 0){
        // console.log('there');
        assetFormFront.style.transform = 'perspective(600px) rotateY(0deg)';
        assetFormFront.style.transitiion = 'none';
        assetFormBack.style.transform = 'perspective(600px) rotateY(180deg)';
        assetFormBack.style.transitiion = 'none';
        assetForm.style.transition = `all 0.4s ease-in-out 0s`;
        assetForm.style.top = `50%`;
        assetForm.style.transform = `translate(-50%, -50%)`;
        assetModalCounter = 1;
    }
    else if(assetModalCounter == 1){
        // console.log('here');
        assetForm.style.top = `0%`;
        assetForm.style.transition = `all 0.4s ease-in-out 0s`;
        assetForm.style.transform = `translate(-50%, -110%)`;
        assetModalCounter = 0;
    }

})