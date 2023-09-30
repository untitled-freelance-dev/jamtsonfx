let toastTimer, toastProgressBar;
const closeToastIcon = document.querySelector(".toast-close");

closeToastIcon.addEventListener('click', closeToast, false);

function activeToast() {
    let toast = document.querySelector(".toast");
    let progress = document.querySelector(".progress");
    toast.removeAttribute('style');
    toast.classList.add("active");
    progress.classList.add("active");
    toastTimer = setTimeout(() => { toast.classList.remove("active"); }, 2000);
    toastProgressBar = setTimeout(() => { 
        progress.classList.remove("active"); 
        toast.style.display = "none";
    }, 2300);
}

function closeToast(event) {
    event.target.parentElement.classList.remove('active')
    setTimeout(() => { event.target.nextElementSibling.classList.remove("active"); }, 300);
    clearTimeout(toastTimer);
    clearTimeout(toastProgressBar);
}

function inputFieldSelector(selectorType) {
    if (selectorType === 'list') {
        document.querySelectorAll(".writing :is(input , textarea)").forEach(inputField => inputField.addEventListener('input', inputFieldAnimation, false));
    }
}

function inputFieldAnimation(event) {
    if (event.currentTarget.value.trim() !== '') {
        event.currentTarget.classList.add('has-text');
    } else {
        event.currentTarget.classList.remove('has-text');
    }
}

function find(elementList, searchElement) {
    let elementIndex = 0;
    for (let index = 0; index < elementList.length; index++) {
        if (elementList[index].tagName === searchElement.tagName){
            if (elementList[index] === searchElement) {
                elementIndex += 1;
                break;
            } else {
                elementIndex += 1
            }
        }
    }
    return elementIndex;
}

function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieList = decodedCookie.split(';');
    for (let index = 0; index < cookieList.length; index++) {
        let cookieElement = cookieList[index];
        while (cookieElement.charAt(0) == ' ') {
            cookieElement = cookieElement.substring(1);
        }
        if (cookieElement.indexOf(name) == 0) {
            return cookieElement.substring(name.length, cookieElement.length);
        }
    }
    return '';
}

export { activeToast, inputFieldSelector, find, getCookie }