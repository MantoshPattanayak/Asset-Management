$(document).ready(function(){
    if(sessionStorage.getItem('sessionVar') != 'pass' && sessionStorage.getItem('sessionVar') != 'userPass'){
        window.location.href = `./index.html`;
    }
    else{

        $('.clearfield').click(function(e){
            e.preventDefault();
            this.previousElementSibling.value = '';
        });

        // console.log(sessionStorage.getItem('userID'));

        let id = sessionStorage.getItem('userID');

        let navOpts = document.querySelector('.sideNav');

        let firstName = document.getElementById('firstName');
        let middleName = document.getElementById('middleName');
        let lastName = document.getElementById('lastName');
        let department = document.getElementById('department');
        let privilege = document.getElementById('privilege');
        let number = document.getElementById('number');
        let email = document.getElementById('email');

        let newPassword = document.getElementById('newPassword');
        let confPassword = document.getElementById('confPassword');
        let submitNewPass = document.getElementById('submitNewPass');

        let newContact = document.getElementById('newContact');
        let submitNewContact = document.getElementById('submitNewContact');

        let logout = document.getElementById('logoutBtn');

        let successLogo = document.querySelectorAll('.successLogo');
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


        if(sessionStorage.getItem('sessionVar') == 'pass'){
            navOpts.innerHTML = `
            <ul>
                <li>
                    <a href="./dashboard.html"><i class='bx bxs-dashboard'></i></a> <!--Dashboard -->
                </li>
                <li>
                    <a href="./alerts.html"><i class='bx bxs-bell' ></i></a> <!--Alert -->
                </li>
                <li>
                    <a href="./requests.html"><i class='bx bxs-layer' ></i></a> <!--Request -->
                </li>
                <li>
                    <a href="./settings2.html"><i class='bx bxs-user'></i></a> <!--Request -->
                </li>
            </ul>`;
        }
        else if(sessionStorage.getItem('sessionVar') == 'userPass'){
            navOpts.innerHTML =`
            <ul>
                <li>
                    <a href="./userDash.html"><i class='bx bxs-dashboard'></i></a> <!--Dashboard -->
                </li>
                <li>
                    <a href="./settings2.html"><i class='bx bxs-user'></i></a> <!--Request -->
                </li>
            </ul>`;
        }

        submitNewContact.addEventListener('click', ()=>{
            let contactState = contactCheck(newContact, newContact.value);
            if(contactState == 1){
                $.post(
                    "http://127.0.0.1:3000/resetContact",
                    {
                        userID : id,
                        contact : newContact.value
                    },
                    function(result){
                        // console.log('result = ' + result);
                        newContact.value = '';
                        if(parseInt(result) == 1){
                            // console.log('if');
                            successLogo[1].style.transition = `opacity 1s ease 0s`;
                            successLogo[1].style.opacity = `100.0`;
                            setTimeout(()=>{
                                successLogo[1].style.transition = `opacity 2s ease 0s`;
                                successLogo[1].style.opacity = `0.0`;
                            }, 1000);
                        }
                        else if(parseInt(result) == 0){
                            // console.log('else');
                        }
                    }
                )
            }
        })

        $.post(
            "http://127.0.0.1:3000/userDetails",
            {
                userID : id
            },
            function(result){
                firstName.innerText = result[0];
                middleName.innerText = result[1];
                lastName.innerText = result[2];
                department.innerText = result[3];
                privilege.innerText = result[4];
                number.innerText = result[5];
                email.innerText = result[6];
            }
        )

       submitNewPass.addEventListener('click', ()=>{
        let inputState1 = passCheck(newPassword, newPassword.value);
        let inputState2 = passCheck(confPassword, confPassword.value);
        
        // console.log(inputState1);
        // console.log(inputState2);

        if(inputState1 == 1 && inputState2 == 1){

            if(newPassword.value == confPassword.value){
                // console.log('posting');
            $.post(
                "http://127.0.0.1:3000/resetPass",
                {
                    userID : sessionStorage.getItem('userID'),
                    newPassword : newPassword.value,
                    confPassword : confPassword.value
                },
                function(result){
                    if(parseInt(result) == 1){
                        successLogo[0].style.transition = `opacity 1s ease 0s`;
                        successLogo[0].style.opacity = `100.0`;
                        setTimeout(()=>{
                            successLogo[0].style.transition = `opacity 2s ease 0s`;
                            successLogo[0].style.opacity = `0.0`;
                        }, 1000);
                    }
                    else if(parseInt(result) == 0){

                    }
                }
            )
            }
            else{
                // password has to be same
                // console.log('password mismatch');
                let ele1 = newPassword.parentElement.nextElementSibling;
                let ele2 = confPassword.parentElement.nextElementSibling;
                ele1.innerText = 'Value has to be same';
                ele2.innerText = 'Value has to be same';
                ele1.style.visibility = 'visible';
                ele2.style.visibility = 'visible';

                
            }
        }
       }) // end of event listener

    } // end of else for session value

})

function passCheck(element, elementValue){
    // console.log(elementValue);
    // console.log(elementValue.trim().length);
    if(elementValue.trim().length > 0){
        let errElement = element.parentElement.nextElementSibling;
        errElement.innerText = 'Error message';
        errElement.style.visibility = 'hidden';
        return 1;
    }
    else{
        errMsg(element, 'field cannot be empty');
        return 0;
    }
}
function contactCheck(element, elementValue){
    let errElement = element.parentElement.nextElementSibling;
    if(elementValue.trim().length == 0){
        // field is empty, return 0
        errMsg(element, 'field cannot be empty')
        return 0;
    }   
    else if(isNaN(elementValue) == true){
        // value is not a number, return 0
        errMsg(element, 'value has to be a number')
        return 0;
    }
    else if(elementValue.trim().lenght > 10){
        errMsg(element, 'number cannot be more than 10 digits')
        return 0;
    }
    else{
        errElement.innerText = 'Error message';
        errElement.style.visibility = 'hidden';
        return 1;
    }

}
function errMsg(element, msg){
    let errElement = element.parentElement.nextElementSibling;
    errElement.innerText = msg;
    errElement.style.visibility = 'visible';
}