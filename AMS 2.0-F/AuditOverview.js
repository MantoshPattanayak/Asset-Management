$(document).ready(function () {
    if (sessionStorage.getItem('sessionVar') != 'pass') {
        window.location.href = `./index.html`;
    }
})









let logout = document.getElementById('logoutBtn');
logout.addEventListener('click', () => {
    $.post(
        "http://127.0.0.1:3000/logout",
        {
            userMail: sessionStorage.getItem('userMail')
        },
        function (result) {
            sessionStorage.setItem('sessionVar', null);
            window.location.href = `./index.html`;
        }
    )
});