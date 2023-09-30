import { readNewsLetter } from './api.js';
import { deleteNewsLetter } from "./api.js";
import { activeToast } from "./component.js";

let toastShortMessage, toastDetailedMessage;

function loadNewsletter(isAdmin) {
    toastShortMessage = document.querySelector('.short-message');
    toastDetailedMessage = document.querySelector('.detailed-message');
    newsLetterView();
}

function deleteRow(event) {
    let rowElement = event.target.parentElement.parentElement;
    let deleteNewsletterAsyncObject = deleteNewsLetter(rowElement.id);
    deleteNewsletterAsyncObject.then(newsletterResponse => {
        if (newsletterResponse.status === 204) {
            toastShortMessage.innerText = 'Success';
            toastDetailedMessage.innerText = `Newsletter ${rowElement.rowIndex} is deleted successfully`;
            rowElement.remove();
            location.reload();
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = `Newsletter ${rowElement.rowIndex} is deletion failed`;
        }        
    });
    activeToast();
}

function newsLetterView() {
    let newsLetterTable = document.querySelector('.newsletter-table');   
    let readNewsLetterAsyncObject = readNewsLetter();
    readNewsLetterAsyncObject.then(newsLetterResponseData => {
        if (newsLetterResponseData) {
            newsLetterResponseData.forEach((newsLetterInfo, index) => {
                newsLetterTable.querySelector('tbody').innerHTML += `<tr id="${newsLetterInfo.id}">
                                                                        <td class="news-letter-sl-no">${index + 1}</td>
                                                                        <td class="news-letter-user-name">${newsLetterInfo.name}</td>
                                                                        <td class="news-letter-user-email">${newsLetterInfo.email}</td>
                                                                        <td>
                                                                            <button class="transparent-button table-combo-button news-letter-delete-button">Delete</button>
                                                                        </td>
                                                                    </tr>`
            });
            newsLetterTable.querySelector('tbody').querySelectorAll(`.news-letter-delete-button`).forEach(deleteButton => deleteButton.addEventListener('click', deleteRow, false));
        }
    })
}

export { loadNewsletter }