const requestURL = 'http://127.0.0.1:8000/'
const requestHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

// Login Operation
async function login(userName, password) {
    let requestBody = JSON.stringify({ "email": userName, "password": password });
    let response = await fetch(`${requestURL}api/authentication/login`, { 'method': 'POST', headers: requestHeaders, body: requestBody });
    return await response.json();
}

// Prop Firm CURD Operation
async function createPropFirm(formHandle, blogContent) {
    let propFirmCreationHeaders = { 'Accept': 'application/json' };
    let formData = new FormData(formHandle);
    formData.append('blog_content', blogContent)
    let response = await fetch(`${requestURL}api/prop-firm/create`, { 'method': 'POST', headers: propFirmCreationHeaders, body: formData });
    return await response.json();
}

async function updatePropFirm(formHandle, blogContent) {
    let propFirmCreationHeaders = { 'Accept': 'application/json' };
    let formData = new FormData(formHandle);
    formData.append('blog_content', blogContent);
    let response = await fetch(`${requestURL}api/prop-firm/update`, { 'method': 'PUT', headers: propFirmCreationHeaders, body: formData });
    return await response;
}

async function readPropFirms(propFirm = '', dataType = '') {
    let fetchURL;
    if (dataType === '') {
        fetchURL = `${requestURL}api/prop-firm/retrieve`;
    } else if (dataType === 'NAME') {
        fetchURL = `${requestURL}api/prop-firm/retrieve?name=${propFirm}`;
    } else {
        fetchURL = `${requestURL}api/prop-firm/retrieve?id=${propFirm}`;
    }
    let response = await fetch(fetchURL, { 'method': 'GET', headers: requestHeaders });
    return await response.json();
}

async function deletePropFirm(propFirm) {
    let response = await fetch(`${requestURL}api/prop-firm/destroy?name=${propFirm}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response;
}

// Category CURD Operation
async function createCategory(categoryName) {
    let requestBody = JSON.stringify({ 'category': categoryName });
    let response = await fetch(`${requestURL}api/prop-firm/category/create`, { 'method': 'POST', headers: requestHeaders, body: requestBody });
    return await response.json();
}

async function updateCategory(categoryID, categoryName) {
    let requestBody = JSON.stringify({ 'id': categoryID, 'category': categoryName });
    let response = fetch(`${requestURL}api/prop-firm/category/update`, { 'method': 'PUT', headers: requestHeaders, body: requestBody });
    return await response;
}

async function readCategory() {
    let response = await fetch(`${requestURL}api/prop-firm/category/retrieve`, { 'method': 'GET', headers: requestHeaders });
    return await response.json();
}

async function deleteCategory(categoryID) {
    let response = await fetch(`${requestURL}api/prop-firm/category/destroy?id=${categoryID}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response;
}

// Questionnaire CURD Operation
async function createQuestionnaire(categoryID, question, answerInfo) {
    let requestBody = JSON.stringify({
        'questionInfo': {
            'category': categoryID,
            'question': question
        },
        'answerInfo': answerInfo
    });
    let response = await fetch(`${requestURL}api/prop-firm/questionnaire/create`, { 'method': 'POST', headers: requestHeaders, body: requestBody });
    return await response.json();
}

async function updateQuestionnaire(categoryID, questionID, question, answerInfo) {
    let requestBody = JSON.stringify({
        'questionInfo': {
            'id': questionID,
            'category': categoryID,
            'question': question
        },
        'answerInfo': answerInfo
    });
    let response = await fetch(`${requestURL}api/prop-firm/questionnaire/update`, { 'method': 'PUT', headers: requestHeaders, body: requestBody });
    return await response;
}

async function readQuestionnaire(category = '') {
    let fetchURL = category ? `${requestURL}api/prop-firm/questionnaire/retrieve?category=${category}` : `${requestURL}api/prop-firm/questionnaire/retrieve`
    let response = await fetch(fetchURL, { 'method': 'GET', headers: requestHeaders });
    return await response.json();
}

async function deleteQuestionnaire(questionID) {
    let response = await fetch(`${requestURL}api/prop-firm/questionnaire/destroy?id=${questionID}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response;
}

// Questionnaire Combination CURD Operation
async function createCombination(questionIDs, answerIDs, propfirmID) {
    let requestBody = JSON.stringify({
        'questionIDs': questionIDs,
        'answerIDs': answerIDs,
        'propFirmID': propfirmID
    });
    let response = await fetch(`${requestURL}api/prop-firm/combination/create`, { 'method': 'POST', headers: requestHeaders, body: requestBody });
    return await response.json();
}

async function updateCombination(combinationID, questionIDs, answerIDs, propfirmID) {
    let requestBody = JSON.stringify({
        'id': combinationID,
        'questionIDs': questionIDs,
        'answerIDs': answerIDs,
        'propFirmID': propfirmID
    });
    let response = await fetch(`${requestURL}api/prop-firm/combination/update`, { 'method': 'PUT', headers: requestHeaders, body: requestBody });
    return await response
}

async function readCombination(combination = '', questionIDs = '', answerIDs = '') {
    let fetchURL = '';
    if (combination) {
        fetchURL = `${requestURL}api/prop-firm/combination/retrieve?combination=${combination}`
    } else if (questionIDs && answerIDs) {
        fetchURL = `${requestURL}api/prop-firm/combination/retrieve?questionIDs=${questionIDs}&answerIDs=${answerIDs}`;
    } else {
        fetchURL = `${requestURL}api/prop-firm/combination/retrieve`
    }
    let response = await fetch(fetchURL, { 'method': 'GET', headers: requestHeaders });
    return await response.json();   
}

async function deleteCombination(combination) {
    let response = await fetch(`${requestURL}api/prop-firm/combination/destroy?id=${combination}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response
}

// Discount CURD Operation
async function createDiscount(propFirmName, discountPercantage, discountCode) {
    let requestBody = JSON.stringify({
        'prop_firm': propFirmName,
        'percentage': discountPercantage,
        'code': discountCode
    });
    let response = await fetch(`${requestURL}api/prop-firm/discount/create`, { 'method': 'POST', headers: requestHeaders, body: requestBody });
    return await response.json();
}

async function updateDiscount(discountID, propFirmName, discountPercantage, discountCode) {
    let requestBody = JSON.stringify({
        'id': discountID,
        'prop_firm': propFirmName,
        'percentage': discountPercantage,
        'code': discountCode
    });
    let response = await fetch(`${requestURL}api/prop-firm/discount/update`, { 'method': 'PUT', headers: requestHeaders, body: requestBody });
    return await response;
}

async function readDiscount() {
    let response = await fetch(`${requestURL}api/prop-firm/discount/retrieve`, { 'method': 'GET', headers: requestHeaders });
    return await response.json();   
}

async function deleteDiscount(discountID) {
    let response = await fetch(`${requestURL}api/prop-firm/discount/destroy?id=${discountID}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response;
}

// News Letter CUR Operation
async function createNewsLetter(formHandle) {
    let newsLetterCreationHeaders = { 'Accept': 'application/json' };
    let formData = new FormData(formHandle);
    let response = await fetch(`${requestURL}api/news-letter/create`, { 'method': 'POST', headers: newsLetterCreationHeaders, body: formData });
    return await response.json();
}

async function readNewsLetter() {
    let response = await fetch(`${requestURL}api/news-letter/retrieve`, { 'method': 'GET', headers: requestHeaders });
    return await response.json();
}

async function deleteNewsLetter(newletterID) {
    let response = await fetch(`${requestURL}api/news-letter/destroy?id=${newletterID}`, { 'method': 'DELETE', headers: requestHeaders });
    return await response;
}

export { login, createPropFirm, updatePropFirm, readPropFirms, deletePropFirm, createCategory, updateCategory, readCategory, deleteCategory, createQuestionnaire, updateQuestionnaire, readQuestionnaire, deleteQuestionnaire, createCombination, updateCombination, readCombination, deleteCombination, createDiscount, updateDiscount, readDiscount, deleteDiscount, createNewsLetter, readNewsLetter, deleteNewsLetter }