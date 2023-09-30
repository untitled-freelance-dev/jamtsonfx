import { login } from "./api.js";

const submit = document.getElementById('submit');

submit.addEventListener('click', loginSubmit, false);

function loginSubmit() {
    let userName = document.getElementById('username');
    let password = document.getElementById('password');
    if (userName.value && password.value) {
        let loginAsyncObject = login(userName.value, password.value);
        loginAsyncObject.then(loginInfo => {
            if (loginInfo.access && loginInfo.refresh) {
                document.cookie = `Asession=${loginInfo.access}`;
                document.cookie = `Rsession=${loginInfo.refresh}`;
                window.location = window.location.href.replace(new RegExp('login'), '');
            }
        });
    }
}