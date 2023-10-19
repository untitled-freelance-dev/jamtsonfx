import { createNewsLetter } from './api.js';
import { loadPropFirm } from './propFirm.js';
import { loadDiscount } from './discount.js';
import { loadBestMatch } from './bestMatch.js';
import { loadNewsletter } from './newsletter.js';
import { loadPropFirmBlogs } from './propFirmBlogs.js';
import { getCookie, inputFieldSelector, activeToast } from './component.js';

let isAdmin
let toastShortMessage = document.querySelector('.short-message');
let toastDetailedMessage = document.querySelector('.detailed-message');
let newsLetterFormHolder = document.querySelector('.news-letter-form-holder');
let closeNewsLetterButton = document.querySelector('.news-letter-form-holder>i');

window.addEventListener('load', windowLoad, false);
document.querySelector('.sidebar li').addEventListener('click', hideSidebar, false);
document.querySelector('.nav-menu-button').addEventListener('click', showSidebar, false);
// window.addEventListener('click', closeNewsLetter, false);
document.getElementById('news-letter-button').addEventListener('click', openNewsLetter, false);
document.getElementById('news-letter-submit').addEventListener('click', newsLetterSubmit, false);
closeNewsLetterButton.addEventListener('click', closeNewsLetter, false);


function windowLoad (event) {
    isAdmin = getCookie('Asession') ? true : false;
    if (isAdmin) {
        let newsLetterViewButton = document.getElementById('news-letter-view');
        newsLetterViewButton.style.display = 'block';
    }
    let bestMatchPage = document.getElementById('best-match');
    let propFirmPage = document.getElementById('prop-firms-page');
    let propFirmBlogsPage = document.getElementById('prop-firm-blogs');
    let discountPage = document.getElementById('discount-page');
    let newsletterPage = document.getElementById('newsletter-page');
    if (bestMatchPage) {
        loadBestMatch(isAdmin);
    } else if (propFirmPage) {
        loadPropFirm(isAdmin);
    } else if (propFirmBlogsPage) {
        loadPropFirmBlogs(isAdmin);
    } else if (discountPage) {
        loadDiscount(isAdmin);
    } else if (newsletterPage) {
        loadNewsletter(isAdmin);
    }
}

function openNewsLetter (event) {
    if (event.target.classList.contains('open')) {
        newsLetterFormHolder.removeAttribute('style');
        event.target.classList.remove('open');
    } else {
        event.target.classList.add('open');
        newsLetterFormHolder.style.display = 'flex';
        inputFieldSelector('list');
    }
}

function closeNewsLetter (event) {
    if (document.getElementById('news-letter-button').classList.contains('open')) {
        document.getElementById('news-letter-button').classList.remove('open');
        newsLetterFormHolder.removeAttribute('style');
    }
}

function newsLetterSubmit(event) {
    let formHandle = document.getElementById('news-letter-form');
    if (formHandle.checkValidity()) {
        let createNewsLetterAsyncObject = createNewsLetter(formHandle);
        createNewsLetterAsyncObject.then(newsLetterResponseData => {
            if (newsLetterResponseData.status) {
                document.getElementById('news-letter-button').classList.remove('open');
                newsLetterFormHolder.removeAttribute('style');
                toastShortMessage.innerText = 'Success';
                toastDetailedMessage.innerText = 'You have subscribed to Jamtson FX';
            } else {
                toastShortMessage.innerText = 'Failed';
                toastDetailedMessage.innerText = 'Your subscription get failed';
            }
        })
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = 'You have not entered required fields'
    }
    activeToast();
}

function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}