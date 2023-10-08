import { activeToast, inputFieldSelector, find } from "./component.js";
import { createCategory, updateCategory, readCategory, deleteCategory, createQuestionnaire, updateQuestionnaire, readQuestionnaire, deleteQuestionnaire, readPropFirms, createCombination, updateCombination, readCombination, deleteCombination } from "./api.js";

let isAdminFlag, toastShortMessage, toastDetailedMessage, startButton, category, quizBox, questionnaire, addQuestionnaireButton, saveQuestionnaireButton, nextCategoryButton, previousCategoryButton, submitQuestionnaireButton, tryAgainButton, viewCombinationButton, refreshCombinationButton, comboBox, questionnaireComboMaker, tableCombo, questionnaireComboCancel, questionnaireComboSubmit, questionnaireMessage;
var categoryQuestionnaireDict = {}

function loadBestMatch(isAdmin) {
    isAdminFlag = isAdmin;
    startButton = document.querySelector('.start-button');
    category = document.querySelector('.category');
    quizBox = document.querySelector('#quiz');
    questionnaire = document.querySelector('.questionnaire');
    nextCategoryButton = document.querySelector('.next');
    previousCategoryButton = document.querySelector('.previous');
    submitQuestionnaireButton = document.querySelector('.submit');
    tryAgainButton = document.querySelector('.try-again');
    toastShortMessage = document.querySelector(".short-message");
    toastDetailedMessage = document.querySelector(".detailed-message");
    questionnaireMessage = document.querySelector('.questionnaire-message');
    startButton.addEventListener('click', getCategoryAndQuestionnaire, false);
    nextCategoryButton.addEventListener('click', nextCategoryQuestionnaire, false);
    previousCategoryButton.addEventListener('click', previousCategoryQuestionnaire, false);
    submitQuestionnaireButton.addEventListener('click', submitQuestionnaire, false);
    // Admin HTML Element
    viewCombinationButton = document.querySelector('.view-combination');
    refreshCombinationButton = document.querySelector('.refresh-combination');
    comboBox = document.querySelector('#combo-box');
    questionnaireComboMaker = document.querySelector('.questionnaire-combination')
    tableCombo = document.querySelector('.combo-table');
    questionnaireComboSubmit = document.querySelector('.questionnaire-combo-submit');
    questionnaireComboCancel = document.querySelector('.questionnaire-combo-cancel');
    let categoryAddButton = document.querySelector('.category-add');

    if (isAdminFlag) {
        addQuestionnaireButton = document.querySelector('.add-questionnaire-button');
        saveQuestionnaireButton = document.querySelector('.save-questionnaire-button'); 
        categoryAddButton.addEventListener('click', addCategory, false);
        addQuestionnaireButton.addEventListener('click', addQuestionnaireForm, false);
        saveQuestionnaireButton.addEventListener('click', saveQuestionnaire, false);
        viewCombinationButton.addEventListener('click', viewCombination, false);
        refreshCombinationButton.addEventListener('click', refreshCombination, false)
        questionnaireComboSubmit.addEventListener('click', submitQuestionnaireCombo, false);
        questionnaireComboCancel.addEventListener('click', cancelQuestionnaireCombo, false);
    } else {
        viewCombinationButton.remove();
        categoryAddButton.remove();
        document.querySelector('#combo-box').remove();
        document.querySelector('.form-operation-button-holder').remove();
    }
}

function getCategoryAndQuestionnaire(event) {
    event.currentTarget.parentElement.parentElement.parentElement.style.display = 'none';
    category.parentElement.parentElement.style.display = 'block';
    category.parentElement.parentElement.nextElementSibling.style.display = 'flex';
    viewCombinationButton.removeAttribute('style');
    if (document.querySelectorAll('.category-item').length <= 0) {
        nextCategoryButton.style.display = 'none';
    } else if (document.querySelectorAll('.category-item').length === 1) {
        submitQuestionnaireButton.style.display = 'flex';
    }
    let readCategoryAsyncObject = readCategory();
    readCategoryAsyncObject.then(categoryInfo => {
        categoryInfo.forEach((categoryData, index) => addCategory(undefined, categoryData.id, categoryData.category, index));
    }).then(() => {
        return category.querySelector('.category-item.editable-step');
    }).then(categoryElement => {
        return categoryElement ? readQuestionnaire(categoryElement.id) : [];
    }).then(questionnaireInfo => {
        questionnaireInfo.forEach(questionnaireData => addQuestionnaireList(questionnaireData));
    });
}

function addCategory(event = undefined, id = '', categoryName = '', categoryCount = undefined) {
    categoryCount = !categoryCount ? category.childElementCount : categoryCount;
    let categoryIDAttribute = !event ? `id="${id}"` : '';
    category.innerHTML += `<div class="category-item current mdl-stepper-step active-step${categoryCount === 0 && categoryName ? ' editable-step': ''}" ${categoryIDAttribute}>
                                <div class="category-index mdl-stepper-circle">${categoryCount + 1}</div>
                                <div class="category-name mdl-stepper-title" contenteditable=${isAdminFlag}>${!event ? categoryName : ''}</div>
                                <div class="mdl-stepper-bar-left"></div>
                                <div class="mdl-stepper-bar-right"></div>
                                ${isAdminFlag ? '<div class="category-button-holder"><img class="category-delete" src="/page_viewer/assets/delete.svg"><img class="category-submit" src="/page_viewer/assets/submit.svg"></div>' : ''}
                            </div>`
    if (document.querySelectorAll('.category-item').length === 1) {
        submitQuestionnaireButton.style.display = 'flex';
    } else if (nextCategoryButton.style.display === 'none') {
        submitQuestionnaireButton.style.display = 'none';
        nextCategoryButton.style.display = 'flex';
    }
    isAdminFlag ? category.querySelectorAll('.category-submit').forEach(element => element.addEventListener('click', upsertCategory, false)) : undefined;
    isAdminFlag ? category.querySelectorAll('.category-delete').forEach(element => element.addEventListener('click', removeCategory, false)) : undefined;
}

function nextCategoryQuestionnaire(event) {
    let allQuestionsAnswered = true;
    let currentCategory = document.querySelector('.category-item.editable-step');
    if (currentCategory) {
        let categoryIndex = parseInt(currentCategory.querySelector('.category-index').innerText.trim());
        categoryQuestionnaireDict[currentCategory.id] = !(currentCategory.id in categoryQuestionnaireDict) ? [] : categoryQuestionnaireDict[currentCategory.id];
        let questionnaireElementList = questionnaire.querySelectorAll('li');
        for (let index = 0; index < questionnaireElementList.length; index++) {
            let questionElement = questionnaireElementList[index].querySelector('.question');
            let selectedAnswerElement = questionnaireElementList[index].querySelector(`input[name="option-${index + 1}"]:checked`);
            if (selectedAnswerElement || isAdminFlag) {
                let questionnaireInfoDict = {
                    'questionInfo': {
                        'id': questionElement.id,
                        'question': questionElement.innerText
                    },
                    'answerInfo': []
                }
                questionnaireElementList[index].querySelectorAll('.answer>label').forEach(answerElement => {
                    questionnaireInfoDict['answerInfo'].push({
                        'id': answerElement.id,
                        'answer': answerElement.querySelector('input').value,
                        'checked': answerElement.querySelector('input').checked
                    });
                });
                categoryQuestionnaireDict[currentCategory.id][index] = questionnaireInfoDict;
            } else {
                toastShortMessage.innerText = 'Failed';
                toastDetailedMessage.innerText = `Question ${index + 1} is not answered`;
                activeToast();
                allQuestionsAnswered = false;
                break;
            }
        }
        if (allQuestionsAnswered) {
            categoryIndex === 1 && category.querySelectorAll('.category-item').length > 1 ? event.currentTarget.previousElementSibling.style.display = 'flex' : undefined;
            currentCategory.classList.remove('editable-step')
            currentCategory.classList.add('step-done');
            let allCategoryList = document.querySelectorAll('.category-item');
            let nextCategory = allCategoryList[categoryIndex]
            nextCategory.classList.add('editable-step')
            let nextCategoryIndex = parseInt(nextCategory.querySelector('.category-index').innerText.trim());
            questionnaireElementList.forEach(questionnaireElement => questionnaireElement.remove());
            if (nextCategory.id) {
                if (nextCategory.id in categoryQuestionnaireDict) {
                    categoryQuestionnaireDict[nextCategory.id].forEach(questionnaireData => addQuestionnaireList(questionnaireData));
                } else {
                    let readQuestionnaireAsyncObject = readQuestionnaire(nextCategory.id);
                    readQuestionnaireAsyncObject.then(questionnaireData => {
                        questionnaireData.forEach(questionnaireInfo => addQuestionnaireList(questionnaireInfo));
                    });
                }
            }
            if (nextCategoryIndex == document.querySelectorAll('.category-item').length) {
                event.currentTarget.style.display = 'none';
                event.currentTarget.nextElementSibling.style.display = 'flex';
            }
        }
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = `There is no category`;
        activeToast();
    }
}

function submitQuestionnaire(event) {
    let allQuestionsAnswered = true;
    let currentCategory = document.querySelector('.category-item.editable-step');
    if (currentCategory) {
        categoryQuestionnaireDict[currentCategory.id] = !(currentCategory.id in categoryQuestionnaireDict) ? [] : categoryQuestionnaireDict[currentCategory.id];
        let questionnaireElementList = questionnaire.querySelectorAll('li');
        for (let index = 0; index < questionnaireElementList.length; index++) {
            let questionElement = questionnaireElementList[index].querySelector('.question');
            let selectedAnswerElement = questionnaireElementList[index].querySelector(`input[name="option-${index + 1}"]:checked`);
            if (selectedAnswerElement || isAdminFlag) {
                let questionnaireInfoDict = {
                    'questionInfo': {
                        'id': questionElement.id,
                        'question': questionElement.innerText
                    },
                    'answerInfo': []
                }
                questionnaireElementList[index].querySelectorAll('.answer>label').forEach(answerElement => {
                    questionnaireInfoDict['answerInfo'].push({
                        'id': answerElement.id,
                        'answer': answerElement.querySelector('input').value,
                        'checked': answerElement.querySelector('input').checked
                    });
                });
                categoryQuestionnaireDict[currentCategory.id][index] = questionnaireInfoDict;
            } else {
                toastShortMessage.innerText = 'Failed';
                toastDetailedMessage.innerText = `Question ${index + 1} is not answered`;
                activeToast();
                allQuestionsAnswered = false;
                break;
            }
        }
        if (allQuestionsAnswered) {
            let questionIDs = [];
            let answerIDs = [];
            let categoryQuestionnaireValuesList = Object.values(categoryQuestionnaireDict);
            categoryQuestionnaireValuesList.forEach(categoryQuestionnaireValues => {
                categoryQuestionnaireValues.forEach(QuestionnaireValues => {
                    let questionInfo = QuestionnaireValues.questionInfo;
                    let answerInfo = QuestionnaireValues.answerInfo;
                    if (questionInfo && answerInfo) {
                        questionIDs.push(questionInfo.id);
                        answerInfo.forEach(answer => answer.checked ? answerIDs.push(answer.id) : undefined)
                    }
                });
            });
            if (questionIDs.length > 0 && answerIDs.length > 0) {
                let readCombinationAsyncObject = readCombination('', questionIDs.join(', '), answerIDs.join(', '));
                readCombinationAsyncObject.then(readCombitaionData => {
                    if (readCombitaionData) {
                        let propFirmNames = [];
                        readCombitaionData.forEach(readCombinationInfo => propFirmNames.push(readCombinationInfo.propFirm));
                        if (propFirmNames.length > 0) {
                            let windowUrl = window.location.href.replace(new RegExp('best-match'), `prop-firms?search=${propFirmNames.join(',')}&found`);
                            window.location.href = windowUrl;
                        } else {
                            questionnaireMessage.style.display = 'block';
                            questionnaireMessage.textContent = 'OOPS there is no match, please try changing your option TRY AGAIN';
                            questionnaire.style.display = 'none';
                            previousCategoryButton.style.display = 'none';
                            submitQuestionnaireButton.style.display = 'none';
                            tryAgainButton.style.display = 'flex';
                        }
                    }
                });
            }
        }
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = `There is no category`;
        activeToast();
    }
}

function previousCategoryQuestionnaire(event = undefined) {
    let visitedCategoryList = document.querySelectorAll('.category-item.step-done');
    let previousCategory = visitedCategoryList[visitedCategoryList.length - 1];
    let categoryIndex = parseInt(previousCategory.querySelector('.category-index').innerText.trim());
    let questionnaireElementList = questionnaire.querySelectorAll('li');
    let currentCategory = document.querySelector('.category-item.editable-step');
    if (currentCategory) {
        categoryQuestionnaireDict[currentCategory.id] = !(currentCategory.id in categoryQuestionnaireDict) ? [] : categoryQuestionnaireDict[currentCategory.id];
        for (let index = 0; index < questionnaireElementList.length; index++) {
            let questionElement = questionnaireElementList[index].querySelector('.question');
            let questionnaireInfoDict = {
                'questionInfo': {
                    'id': questionElement.id,
                    'question': questionElement.innerText
                },
                'answerInfo': []
            }
            questionnaireElementList[index].querySelectorAll('.answer>label').forEach(answerElement => {
                questionnaireInfoDict['answerInfo'].push({
                    'id': answerElement.id,
                    'answer': answerElement.querySelector('input').value,
                    'checked': answerElement.querySelector('input').checked
                });
            });
            categoryQuestionnaireDict[currentCategory.id][index] = questionnaireInfoDict;
            questionnaireElementList[index].remove();
        }
    }
    currentCategory ? currentCategory.classList.remove('editable-step') : undefined;
    previousCategory.classList.remove('step-done');
    previousCategory.classList.add('editable-step');
    if (event) {
        if (event.currentTarget.nextElementSibling.style.display === 'none') {
            event.currentTarget.nextElementSibling.style.display = 'flex';
            event.currentTarget.nextElementSibling.nextElementSibling.style.display = 'none';
        }
        categoryIndex === 1 ? event.currentTarget.style.display = 'none' : undefined;
    } else {
        nextCategoryButton.style.display = 'flex';
        submitQuestionnaireButton.style.display = 'none';
        categoryIndex === 1 ? previousCategoryButton.style.display = 'none' : undefined;
    }
    if (previousCategory.id in categoryQuestionnaireDict) {
        categoryQuestionnaireDict[previousCategory.id].forEach(questionnaireData => addQuestionnaireList(questionnaireData));
    } else {
        let readQuestionnaireAsyncObject = readQuestionnaire(previousCategory.id);
        readQuestionnaireAsyncObject.then(questionnaireData => {
            questionnaireData.forEach(questionnaireInfo => addQuestionnaireList(questionnaireInfo));
        });
    }
}

function addQuestionnaireList(questionnaireData) {
    let answerOptions = '';
    questionnaireData.answerInfo.forEach((answerData) => {
        answerOptions += `<div class="answer">
                            <label id="${answerData.id}">
                                <input type="radio" name="option-${questionnaire.childElementCount + 1}" value="${answerData.answer}" ${answerData.checked ? 'checked="true"' : ''}>
                                <div class="view"></div>
                                ${answerData.answer}
                            </label>
                        </div>`;
    });
    questionnaire.innerHTML += `<li>
                                    <div class="questionnaire-and-button-holder">
                                        <div class="questionnaire-holder">
                                            <div class="question" id="${questionnaireData.questionInfo.id}">${questionnaireData.questionInfo.question}</div>
                                            ${answerOptions}
                                        </div>
                                        ${isAdminFlag ? ' \
                                        <div class="questionnaire-button-holder"> \
                                            <button class="transparent-button icon-button edit-questionnaire-button"> \
                                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"></path></svg> \
                                            </button> \
                                            <button class="transparent-button icon-button update-questionnaire-button"> \
                                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#04d9ff"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path></svg> \
                                            </button> \
                                            <button class="transparent-button icon-button delete-questionnaire-button"> \
                                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"></path></svg> \
                                            </button> \
                                        </div>' : ''}
                                    </div>
                                </li>`;
    isAdminFlag ? questionnaire.querySelectorAll('.edit-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', questionnaireFormConvertion, true)) : undefined;
    isAdminFlag ? questionnaire.querySelectorAll('.update-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', modifyQuestionnaire, false)) : undefined;
    isAdminFlag ? questionnaire.querySelectorAll('.delete-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', removeQuestionnaire, false)) : undefined;
}

function updateQuestionnaireList(questionID, question, answerInfo, questionnaireIndex) {
    let answerOptions = '';
    answerInfo.forEach((answerData) => {
        answerOptions += `<div class="answer">
                            <label id="${answerData.id}">
                                <input type="radio" name="option-${questionnaireIndex}" value="${answerData.answer}">
                                <div class="view"></div>
                                ${answerData.answer}
                            </label>
                        </div>`;
    });
    questionnaire.querySelectorAll('li')[questionnaireIndex - 1].innerHTML = `<div class="questionnaire-and-button-holder">
                                    <div class="questionnaire-holder">
                                        <div class="question" id="${questionID}">${question}</div>
                                        ${answerOptions}
                                    </div>
                                    <div class="questionnaire-button-holder">
                                        <button class="transparent-button icon-button edit-questionnaire-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"></path></svg>
                                        </button>
                                        <button class="transparent-button icon-button update-questionnaire-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#04d9ff"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"></path></svg>
                                        </button>
                                        <button class="transparent-button icon-button delete-questionnaire-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"></path></svg>
                                        </button>
                                    </div>
                                </div>`;
    questionnaire.querySelectorAll('li')[questionnaireIndex - 1].querySelectorAll('.edit-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', questionnaireFormConvertion, true));
    questionnaire.querySelectorAll('li')[questionnaireIndex - 1].querySelectorAll('.update-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', modifyQuestionnaire, false));
    questionnaire.querySelectorAll('li')[questionnaireIndex - 1].querySelectorAll('.delete-questionnaire-button').forEach(buttonElement => buttonElement.addEventListener('click', removeQuestionnaire, false));
}

function addQuestionnaireForm(event) {
    if (event.currentTarget.classList.contains('add-questionnaire')) {
        let questionnaireActionButtonHolderElement = document.querySelector('.form-operation-button-holder');
        let questionnaireFormElement = document.createElement('form');
        Object.assign(questionnaireFormElement, { className: 'questionnaire-form custom-input-holder' });
        questionnaireFormElement.innerHTML = `<div class="question-field textarea writing">
                                                <textarea name="question-field" required=""></textarea>
                                                <label for="question-field">Question</label>
                                                <span></span>
                                            </div>
                                            <div class="answer-field-count-holder">
                                                <div class="answer-field-holder">
                                                    <div class="answer-field text writing">
                                                        <input type="text" name="question" required="">
                                                        <label for="answer">Answer 1</label>
                                                        <span></span>
                                                    </div>
                                                    <div class="answer-field text writing">
                                                        <input type="text" name="question" required="">
                                                        <label for="answer">Answer 2</label>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div class="answer-number">
                                                    <label class="answer-number-label">Fields Number</label>
                                                    <div class="fields-number">
                                                        <label for="fields-number" class="decrement">
                                                            <svg viewBox="0 0 448 512" fill="white">
                                                            <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path>
                                                            </svg>
                                                        </label>
                                                        <input type="number" id="fields-number" name="fields-number" min="2" max="10" readonly="" value="2">
                                                        <label for="fields-number" class="increment">
                                                            <svg viewBox="0 0 448 512" fill="white">
                                                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
                                                            </svg>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>`;
        quizBox.insertBefore(questionnaireFormElement, questionnaireActionButtonHolderElement);
        inputFieldSelector('list');
        questionnaireFormElement.querySelector('.increment').addEventListener('click', addAnswerFields, false);
        questionnaireFormElement.querySelector('.decrement').addEventListener('click', removeAnswerFields, false);
        event.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#04d9ff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';
        event.currentTarget.previousElementSibling.style.display = 'flex';
        event.currentTarget.classList.remove('add-questionnaire');
    } else {
        let questionnaireForm = document.querySelector(".questionnaire-form");
        questionnaireForm.remove();
        event.currentTarget.classList.add('add-questionnaire');
        event.currentTarget.previousElementSibling.removeAttribute('style');
        event.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
    }
}

function questionnaireFormConvertion(event) {
    let element = event.currentTarget.parentElement.previousElementSibling;
    if (!event.currentTarget.className.includes('cancel-edit')) {
        let answerFormElement = '';
        let answerElementsList = element.querySelectorAll('.answer');
        answerElementsList.forEach((answerElement, index) => {
            answerFormElement += `<div class="answer-field text writing">
                                    <input class="has-text" type="text" name="question" required="" value="${answerElement.querySelector('input').value}">
                                    <label id="${answerElement.querySelector('label').id}" for="answer">Answer ${index + 1}</label>
                                    <span></span>
                                </div>`
        })
        let questionnaireFormElement = document.createElement('form');
        Object.assign(questionnaireFormElement, { className: 'questionnaire-form custom-input-holder' });
        questionnaireFormElement.innerHTML = `<div id="${element.querySelector('.question').id}" class="question-field textarea writing">
                                                <textarea class="has-text" name="question-field" required="">${element.querySelector('.question').innerText}</textarea>
                                                <label for="question-field">Question</label>
                                                <span></span>
                                            </div>
                                            <div class="answer-field-count-holder">
                                                <div class="answer-field-holder">${answerFormElement}</div>
                                                <div class="answer-number">
                                                    <label class="answer-number-label">Fields Number</label>
                                                    <div class="fields-number">
                                                        <label for="fields-number" class="decrement"><svg viewBox="0 0 448 512" fill="white"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"></path></svg></label>
                                                        <input type="number" id="fields-number" name="fields-number" min="2" max="10" readonly="" value="${answerElementsList.length}">
                                                        <label for="fields-number" class="increment"><svg viewBox="0 0 448 512" fill="white"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path></svg></label>
                                                    </div>
                                                </div>
                                            </div>`;
        element.parentElement.insertBefore(questionnaireFormElement, event.currentTarget.parentElement);
        inputFieldSelector('list');
        element.style.display = 'none';
        event.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#04d9ff"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';
        event.currentTarget.classList.add('cancel-edit');
        element.nextElementSibling.querySelector('.increment').addEventListener('click', addAnswerFields, false);
        element.nextElementSibling.querySelector('.decrement').addEventListener('click', removeAnswerFields, false);
    } else {
        event.currentTarget.classList.remove('cancel-edit');
        event.currentTarget.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/></svg>';
        let questionnaireForm = document.querySelector(".questionnaire-form");
        questionnaireForm.remove();
        event.currentTarget.parentElement.previousElementSibling.removeAttribute('style');
        addQuestionnaireButton.removeAttribute('style');
    }
}

function viewCombination(event) {
    if (event.target.textContent === 'Combinations') {
        event.target.textContent = 'Hide Combinations'
        refreshCombinationButton.style.display = 'flex';
        comboBox.style.display = 'flex';
        let readQuestionnaireAsyncObject = readQuestionnaire();
        readQuestionnaireAsyncObject.then(questionnaireData => {
            if (questionnaireData.length > 0) {
                questionnaireData.forEach((questionnaireInfo, index) => questionnaireCombinationMakerList(index, questionnaireInfo));
                let readPropFirmAsyncObject = readPropFirms();
                readPropFirmAsyncObject.then(propFirmData => {
                    createPropFirmList(propFirmData);
                    let readQuestionnaireComboAsyncObject = readCombination();
                    readQuestionnaireComboAsyncObject.then(questionnaireComboData => {
                        questionnaireComboData.forEach((questionnaireComboInfo, index) => createComboTable(questionnaireComboInfo, index + 1))
        });
                });
            } else {
                questionnaireComboMaker.innerHTML = '';
            }
        });
    } else {
        event.target.textContent = 'Combinations';
        comboBox.removeAttribute('style');
        refreshCombinationButton.removeAttribute('style');
        tableCombo.querySelector('tbody').innerHTML = '';
        questionnaireComboMaker.innerHTML = '';
    }
}

function refreshCombination(event) {
    tableCombo.querySelector('tbody').innerHTML = '';
    questionnaireComboMaker.innerHTML = '';
    let readQuestionnaireAsyncObject = readQuestionnaire();
    readQuestionnaireAsyncObject.then(questionnaireData => {
        if (questionnaireData.length > 0) {
            questionnaireData.forEach((questionnaireInfo, index) => questionnaireCombinationMakerList(index, questionnaireInfo));
            let readPropFirmAsyncObject = readPropFirms();
            readPropFirmAsyncObject.then(propFirmData => {
                createPropFirmList(propFirmData);
                let readQuestionnaireComboAsyncObject = readCombination();
                readQuestionnaireComboAsyncObject.then(questionnaireComboData => {
                    questionnaireComboData.forEach((questionnaireComboInfo, index) => createComboTable(questionnaireComboInfo, index + 1))
    });
            });
        } else {
            questionnaireComboMaker.innerHTML = '';
        }
    });
}

function questionnaireCombinationMakerList(questionnaireIndex, questionnaireData) {
    let answerOptions = '';
    questionnaireData.answerInfo.forEach((answerData) => {
        answerOptions += `<div class="answer">
                            <label id="${answerData.id}">
                                <input type="radio" name="option-${questionnaireIndex + 1}" value="${answerData.answer}" ${answerData.checked ? 'checked="true"' : ''}>
                                <div class="view"></div>
                                ${answerData.answer}
                            </label>
                        </div>`;
    });
    questionnaireComboMaker.innerHTML += `<li>
                                            <div class="questionnaire-holder">
                                                <div class="question" id="${questionnaireData.questionInfo.id}">${questionnaireData.questionInfo.question}</div>
                                                ${answerOptions}
                                            </div>
                                        </li>`;
}

function createPropFirmList(propFirmData) {
    let propFirmOptions = '';
    propFirmData.forEach(propFirmInfo => propFirmOptions += `<option id="${propFirmInfo.id}" value="${propFirmInfo.name}">${propFirmInfo.name.toLowerCase().split(" ").reduce((sentence, character) => sentence + "" + (character.charAt(0).toUpperCase() + character.slice(1) + " "), '')}</option>`)
    questionnaireComboMaker.innerHTML += `<div class="prop-firm-dropdown">
                                            <label class="prop-firm-label">Prop Firm</label>
                                            <div class="view">
                                            <select id="prop-firm-name" name="prop-firm-name">
                                                <option value="" selected disabled>Select Prop Firm</option>
                                                ${propFirmOptions}
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                                            </div>
                                        </div>`
    questionnaireComboMaker.querySelector('#prop-firm-name').addEventListener('click', dropDownOpenStyle, false);
    questionnaireComboMaker.querySelector('#prop-firm-name').addEventListener('blur', dropDownCloseStyle, false);
}

function createComboTable(createCombinationData, index) {
    tableCombo.parentElement.style.display = 'flex';
    let questionnaireCombination = createComboFromQuestionnaire(createCombinationData.questionIDs, createCombinationData.answerIDs)
    let propFirmName = document.getElementById(createCombinationData.propFirm).textContent.trim();
    tableCombo.querySelector('tbody').innerHTML += `<tr id="${createCombinationData.id}">
                                                                <td>${index}</td>
                                                                <td class="combination-data">${questionnaireCombination.join('; ')}
                                                                <td class="prop-firm-name-data">${propFirmName}</td>
                                                                <td>
                                                                    <button class="transparent-button table-combo-button edit-button">Edit</button>
                                                                    <button class="transparent-button table-combo-button delete-button">Delete</button>
                                                                </td>
                                                            </tr>`;
    tableCombo.querySelectorAll('.edit-button').forEach(element => element.addEventListener('click', editQuestionnaireCombo, false));
    tableCombo.querySelectorAll('.delete-button').forEach(element => element.addEventListener('click', deleteQuestionnaireCombo, false));
}

function editQuestionnaireCombo(event) {
    let rowElement = event.target.parentElement.parentElement;
    rowElement.style.display = 'none';
    let readQuestionnaireComboAsyncObject = readCombination(rowElement.id);
    readQuestionnaireComboAsyncObject.then(questionnaireComboData => {
        questionnaireComboData.forEach(questionnaireComboInfo => {
            let questionIDList = questionnaireComboInfo.questionIDs.split(', ');
            let answerIDList = questionnaireComboInfo.answerIDs.split(', ');
            let propFirmID = questionnaireComboInfo.propFirm.split(', ');
            for (let index = 0; index < questionIDList.length; index ++) {
                questionnaireComboMaker.querySelectorAll('.questionnaire-holder')[index].querySelectorAll('.answer>label').forEach(element => element.id === answerIDList[index] ? element.querySelector('input').checked = true : undefined);
            }
            questionnaireComboMaker.querySelector('#prop-firm-name').value = document.getElementById(propFirmID).value;
        });
    });
    questionnaireComboCancel.removeAttribute('style');
    rowElement.classList.add('edited-row');
    questionnaireComboSubmit.classList.add('update-combo');
}

function cancelQuestionnaireCombo(event) {
    event.currentTarget.style.display = 'none';
    let updatedRowElement = tableCombo.querySelector('.edited-row');
    updatedRowElement.removeAttribute('style');
    questionnaireComboMaker.querySelectorAll('input:checked').forEach(element => element.checked = false);
    questionnaireComboMaker.querySelector('#prop-firm-name').value = '';
}

function upsertCategory(event) {
    let categoryID = event.target.parentElement.parentElement.id;
    let categoryName = event.target.parentElement.parentElement.querySelector('.category-name').innerText.trim();
    let categoryIndex = parseInt(event.target.parentElement.parentElement.querySelector('.category-index').innerText.trim());
    if (categoryName) {
        if (!categoryID) {
            categoryIndex === 1 ? event.target.parentElement.parentElement.classList.add('editable-step') : undefined;
            let createCategoryAsyncObject = createCategory(categoryName);
            createCategoryAsyncObject.then(categoryInfo => {
                if (categoryInfo.status) {
                    event.target.parentElement.parentElement.id = categoryInfo.categoryID;
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Category ${categoryIndex} is created successfully`;
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Category ${categoryIndex} creation failed`;
                }
            });
        } else {
            let updateCategoryAsyncObject = updateCategory(categoryID, categoryName);
            updateCategoryAsyncObject.then(categoryResponse => {
                if (categoryResponse.status === 204) {
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Category ${categoryIndex} is updated successfully`;
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Category ${categoryIndex} updation failed`;
                }
            });
        }
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = `Category ${categoryIndex > 0 ? categoryIndex : 1} is empty`;
    }
    activeToast();
}

function removeCategory(event) {
    let categoryID = event.currentTarget.parentElement.parentElement.id;
    let categoryIndex = parseInt(event.target.parentElement.parentElement.querySelector('.category-index').innerText.trim());
    if (categoryID) {
        let deleteCategoryAsyncObject = deleteCategory(categoryID);
        deleteCategoryAsyncObject.then(categoryResponse => {
            if (categoryResponse.status === 204) {
                toastShortMessage.innerText = 'Success';
                toastDetailedMessage.innerText = `Category ${categoryIndex} is deleted successfully`;
                Array.from(document.querySelectorAll('.category-item')).slice(categoryIndex).forEach(categoryElement => {
                    categoryElement.querySelector('.category-index').innerText = parseInt(categoryElement.querySelector('.category-index').innerText.trim()) - 1
                });
                if (event.target.parentElement.parentElement === document.querySelector('.category-item.editable-step')) {
                    event.target.parentElement.parentElement.remove();
                    (categoryID in categoryQuestionnaireDict) ? delete categoryQuestionnaireDict[categoryID] : undefined
                    if (categoryIndex === 1) {
                        questionnaire.querySelectorAll('li').forEach(questionnaireElement => questionnaireElement.remove());
                        if (document.querySelectorAll('.category-item').length > 0) {
                            document.querySelectorAll('.category-item')[0].classList.add('editable-step');
                            let readQuestionnaireAsyncObject = readQuestionnaire(document.querySelector('.category-item.editable-step').id);
                            readQuestionnaireAsyncObject.then(questionnaireData => {
                                questionnaireData.forEach(questionnaireInfo => addQuestionnaireList(questionnaireInfo));
                            });
                        }
                    } else {
                        previousCategoryQuestionnaire();
                    }
                } else {
                    event.target.parentElement.parentElement.remove();
                    (categoryID in categoryQuestionnaireDict) ? delete categoryQuestionnaireDict[categoryID] : undefined
                }
            } else {
                toastShortMessage.innerText = 'Failed';
                toastDetailedMessage.innerText = `Category ${categoryIndex} deletion failed`;
            }
        });
    } else {
        toastShortMessage.innerText = 'Success';
        toastDetailedMessage.innerText = `Category ${categoryIndex > 0 ? categoryIndex : 1} has been deleted`;
        Array.from(document.querySelectorAll('.category-item')).slice(categoryIndex).forEach(categoryElement => {
            categoryElement.querySelector('.category-index').innerText = parseInt(categoryElement.querySelector('.category-index').innerText.trim()) - 1
        });
        event.target.parentElement.parentElement.remove();
    }
    if (document.querySelectorAll('.category-item').length === 1 || categoryIndex === document.querySelectorAll('.category-item').length || categoryIndex + 1 === document.querySelectorAll('.category-item').length) {
        submitQuestionnaireButton.style.display = 'flex';
        nextCategoryButton.style.display !== 'none' ? nextCategoryButton.style.display = 'none' : undefined;
    }
    activeToast();
}

function saveQuestionnaire(event) {
    let currentCategory = document.querySelector('.category-item.editable-step');
    let questionnaireForm = document.querySelector(".questionnaire-form");
    if (currentCategory && currentCategory.id !== '') {
        if (questionnaireForm.checkValidity()) {

            let questionField = document.querySelector('.question-field textarea');
            let answerField = document.querySelectorAll('.answer-field input');
            let answerInfo = [];
            answerField.forEach(answerFieldElement => {
                answerInfo.push({ 'answer': answerFieldElement.value });
            });
            let createQuestionnaireAsyncObject = createQuestionnaire(currentCategory.id, questionField.value, answerInfo)
            createQuestionnaireAsyncObject.then(questionnaireInfo => {
                if (questionnaireInfo.status) {
                    addQuestionnaireList(questionnaireInfo.data);
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Questionnaire ${questionnaire.childElementCount} is created successfully`;
                    questionnaireForm.remove();
                    event.target.removeAttribute('style');
                    addQuestionnaireButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
                    addQuestionnaireButton.classList.add('add-questionnaire');
                }
                else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Questionnaire ${questionnaire.childElementCount + 1} creation failed`;
                }
            });
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = 'You have not entered required fields';
        }
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = 'You have to create category first';
    }
    activeToast();
}

function modifyQuestionnaire(event) {
    let questionnaireForm = document.querySelector('.questionnaire-form');
    let questionnaireElement = event.currentTarget.parentElement.previousElementSibling;
    let questionnaireIndex = find(questionnaire.childNodes, questionnaireElement.parentElement.parentElement);
    if (questionnaireForm) {
        if (questionnaireForm.checkValidity()) {
            let currentCategory = document.querySelector('.category-item.editable-step');
            let questionField = questionnaireElement.querySelector('.question-field textarea');
            let answerField = questionnaireElement.querySelectorAll('.answer-field input');
            let answerInfo = [];
            answerField.forEach(answerFieldElement => {
                answerInfo.push({ 'id': answerFieldElement.nextElementSibling.id, 'answer': answerFieldElement.value });
            });
            let updateQuestionnaireAsyncObject = updateQuestionnaire(currentCategory.id, questionField.parentElement.id, questionField.value, answerInfo);
            updateQuestionnaireAsyncObject.then(questionnaireResponse => {
                if (questionnaireResponse.status === 204) {
                    updateQuestionnaireList(questionField.parentElement.id, questionField.value, answerInfo, questionnaireIndex);
                    toastShortMessage.innerText = 'Success';
                    questionnaireElement.remove();
                    toastDetailedMessage.innerText = `Questionnaire ${questionnaireIndex} is updated successfully`;
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Questionnaire ${questionnaireIndex} updation failed`;
                }
            });
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = `You have not entered required fields in questionnaire ${questionnaireIndex}`;
        }
        activeToast();
    }
}

function removeQuestionnaire(event) {
    let questionElement = event.currentTarget.parentElement.previousElementSibling.querySelector('.question');
    let questionnaireIndex = find(questionnaire.childNodes, event.currentTarget.parentElement.parentElement.parentElement);
    let deleteQuestionnaireAsyncObject = deleteQuestionnaire(questionElement.id)
    deleteQuestionnaireAsyncObject.then(questionnaireResponse => {
        if (questionnaireResponse.status === 204) {
            toastShortMessage.innerText = 'Success';
            toastDetailedMessage.innerText = `Questionnaire ${questionnaireIndex} is deleted successfully`;
            event.target.parentElement.parentElement.parentElement.remove();
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = `Questionnaire ${questionnaireIndex} deletion failed`;
        }
    });
    activeToast();
}

function submitQuestionnaireCombo(event) {
    let questionIDs = [];
    let answerIDs = [];
    let questionnaireCombinationList = questionnaireComboMaker.querySelectorAll('li');
    for (let index = 0; index < questionnaireCombinationList.length; index++) {
        let questionID = questionnaireCombinationList[index].querySelector('.question').id;
        let answerElement = questionnaireCombinationList[index].querySelector(`input[name="option-${index + 1}"]:checked`);
        if (answerElement) {
            questionIDs.push(questionID);
            answerIDs.push(answerElement.parentElement.id);
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = `Question ${index + 1} is not answered`;
            break;
        }
    }
    let propFirmID = questionnaireComboMaker.querySelectorAll('#prop-firm-name>option')[questionnaireComboMaker.querySelector('#prop-firm-name').selectedIndex].id;
    if (propFirmID) {
        if (!event.currentTarget.className.includes('update-combo')) {
            let createCombinationAsyncObject = createCombination(questionIDs.join(', '), answerIDs.join(', '), propFirmID);
            createCombinationAsyncObject.then(createCombinationData => {
                if (createCombinationData.status) {
                    createCombinationData['questionIDs'] = questionIDs.join(', ');
                    createCombinationData['answerIDs'] = answerIDs.join(', ');
                    createCombinationData['propFirm'] = propFirmID;
                    createComboTable(createCombinationData, tableCombo.rows.length)
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Prop Firm Combo ${tableCombo.rows.length} is created`;
                }
            });
        } else {
            let updatedRowElement = tableCombo.querySelector('.edited-row');
            let updateCombinationAsyncObject = updateCombination(updatedRowElement.id, questionIDs.join(', '), answerIDs.join(', '), propFirmID);
            updateCombinationAsyncObject.then(updateCombinationResponse => {
                if (updateCombinationResponse.status === 204) {
                    let questionnaireCombination = createComboFromQuestionnaire(questionIDs.join(', '), answerIDs.join(', '));
                    let propFirmName = document.getElementById(propFirmID).textContent.trim();
                    updatedRowElement.querySelector('.combination-data').textContent = questionnaireCombination.join('; ');
                    updatedRowElement.querySelector('.prop-firm-name-data').textContent = propFirmName;
                    updatedRowElement.classList.remove('edited-row');
                    questionnaireComboSubmit.classList.remove('update-combo');
                    updatedRowElement.removeAttribute('style');
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Prop Firm Combo ${updatedRowElement.rowIndex} is updated successfully`;
                }
            })

        }
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = `Prop Firm is not selected`;
    }
    activeToast();
}

function deleteQuestionnaireCombo(event) {
    let rowElement = event.currentTarget.parentElement.parentElement;
    let deleteCombinationAsyncObject = deleteCombination(rowElement.id);
    deleteCombinationAsyncObject.then(deleteeCombinationResponse => {
        if (deleteeCombinationResponse.status === 204) {
            toastShortMessage.innerText = 'Success';
            toastDetailedMessage.innerText = `Prop Firm Combo ${rowElement.rowIndex} is deleted successfully`;
            rowElement.remove();
        }
    })
    activeToast();
}

function createComboFromQuestionnaire(questionIDs, answerIDs) {
    let questionIDList = questionIDs.split(', ');
    let answerIDList = answerIDs.split(', ');
    let questionnaireCombination = [];
    for (let questionIndex = 0; questionIndex < questionIDList.length; questionIndex++) {
        let answerIndex;
        let questionnaireComboList = questionnaireComboMaker.querySelectorAll('li');
        let answerLabelList = questionnaireComboList[questionIndex].querySelectorAll('.answer>label')
        answerLabelList.forEach((element, elementIndex) => element.id === answerIDList[questionIndex] ? answerIndex = elementIndex + 1 : undefined);
        questionnaireCombination.push(`${questionIndex + 1} -> ${(answerIndex + 9).toString(36).toUpperCase()}`)
    }
    return questionnaireCombination
}

function addAnswerFields(event) {
    if (parseInt(event.currentTarget.previousElementSibling.value) < parseInt(event.currentTarget.previousElementSibling.max)) {
        let answerFieldHolder = document.querySelector('.answer-field-holder');
        let answerFieldElement = document.createElement('div');
        Object.assign(answerFieldElement, { className: 'answer-field text writing' });
        answerFieldElement.innerHTML += `<input type="text" name="question" required="">
                                        <label for="answer">Answer ${parseInt(event.currentTarget.previousElementSibling.value) + 1}</label>
                                        <span></span>`;
        answerFieldHolder.append(answerFieldElement);
        event.currentTarget.previousElementSibling.value = parseInt(event.currentTarget.previousElementSibling.value) + 1;
        inputFieldSelector('list');
    }
}

function removeAnswerFields(event) {
    if (parseInt(event.currentTarget.nextElementSibling.value) > parseInt(event.currentTarget.nextElementSibling.min)) {
        event.currentTarget.nextElementSibling.value = parseInt(event.currentTarget.nextElementSibling.value) - 1
        let answerField = document.querySelectorAll(".answer-field");
        answerField[answerField.length - 1].remove();
    }
}

function dropDownOpenStyle(event) {
    if (event.currentTarget.classList.contains('select-open')) {
        event.currentTarget.classList.remove('select-open');
    } else {
        event.currentTarget.classList.add('select-open'); 
    }
}

function dropDownCloseStyle(event) {
    event.currentTarget.classList.remove('select-open');
}

export { loadBestMatch }