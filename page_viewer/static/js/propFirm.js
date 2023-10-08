import { readPropFirms } from "./api.js";

function loadPropFirm(isAdmin) {
    isAdmin ? document.querySelector('.prop-firm-container').removeAttribute('style') : document.querySelector('.prop-firm-container').remove();
    let propfirmcards = document.querySelector('.cards');
    let searchQuery = document.getElementById('prop-firms-page').className;
    let questionnaireMessage = document.querySelector('.questionnaire-message');
    if (searchQuery) {
        if (new URLSearchParams(window.location.search).get('found') === '') {
            questionnaireMessage.style.display = 'block';
            questionnaireMessage.textContent = 'BELOW ARE THE MATCHING FIRMS ACCORDING TO THE OPTION THAT YOU HAVE CHOSEN';
        }
        searchQuery.split(',').forEach(propFirmName => {
            let readPropFirmCardAsyncObject = readPropFirms(propFirmName, 'ID');
            readPropFirmCardAsyncObject.then(propFirmResponse => {
                if (propFirmResponse) {
                    propFirmResponse.forEach(popFirmsResponseData => {
                        propfirmcards.innerHTML += `<li class="cards-item">
                                            <div class="prop-firm-card">
                                                <div class="card-image"><img src="${popFirmsResponseData.logo}" height="305px" width="305px"></div>
                                                <div class="card-content">
                                                    <h2 class="card-title">${popFirmsResponseData.name}</h2>
                                                    <p class="card-text">${popFirmsResponseData.summary ? popFirmsResponseData.summary : "Please Provide some description"}</p>
                                                    <div class="prop-firms-read-site-button-holder">
                                                        <a href="prop-firms/${popFirmsResponseData.name}" style="text-decoration:none">
                                                            <button class="transparent-button card-btn">Read More</button>
                                                        </a>
                                                        <a href="${popFirmsResponseData.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                                                            <button class="transparent-button card-btn">VISIT SITE</button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>`
                    });
                }
            });
        });
    } else {
        let readPropFirmCardAsyncObject = readPropFirms();
        readPropFirmCardAsyncObject.then(propFirmResponse => {
            if (propFirmResponse) {
                propFirmResponse.forEach(popFirmsResponseData => {
                    propfirmcards.innerHTML += `<li class="cards-item">
                                        <div class="prop-firm-card">
                                            <div class="card-image"><img src="${popFirmsResponseData.logo}" height="305px" width="305px"></div>
                                            <div class="card-content">
                                                <h2 class="card-title">${popFirmsResponseData.name}</h2>
                                                <p class="card-text">${popFirmsResponseData.summary ? popFirmsResponseData.summary : "Please Provide some description"}</p>
                                                <div class="prop-firms-read-site-button-holder">
                                                    <a href="prop-firms/${popFirmsResponseData.name}" style="text-decoration:none">
                                                        <button class="transparent-button card-btn">Read More</button>
                                                    </a>
                                                    <a href="${popFirmsResponseData.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                                                        <button class="transparent-button card-btn">VISIT SITE</button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`
                });
            }
        });
    }
}

export { loadPropFirm }