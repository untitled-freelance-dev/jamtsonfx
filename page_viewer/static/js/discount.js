import { activeToast, find } from "./component.js";
import { readPropFirms, createDiscount, updateDiscount, deleteDiscount, readDiscount } from "./api.js";

let isAdminFlag, toastShortMessage, toastDetailedMessage;

function loadDiscount(isAdmin) {
    isAdminFlag = isAdmin
    let discountButtonHolder = document.querySelector('.discount-button-container')
    if (isAdmin) {
        discountButtonHolder.removeAttribute('style');
        let addDiscountButton = document.getElementById('add-discount');
        toastShortMessage = document.querySelector('.short-message');
        toastDetailedMessage = document.querySelector('.detailed-message');
        addDiscountButton.addEventListener('click', addRow, false);
    } else {
        discountButtonHolder.remove();
        document.evaluate("//th[contains(text(), 'Buttons')]", document, null, 9, null ).singleNodeValue.remove();
    }
    getRow();
}

function getRow() {
    let tableRowCount = document.querySelector(".discount-table").rows.length;
    let tbodyElement = document.querySelector('.discount-table tbody');
    let readDiscountAsyncObjec = readDiscount();
    readDiscountAsyncObjec.then(discountResponse => {
        for (let index = 1; index <= discountResponse.length; index++) {
            let dicountCodeElement = '';
            let discountResponseData = discountResponse[index - 1];
            if (discountResponseData.code.match(new RegExp('^(?:http[s]*|www).|\/\/'))) {
                dicountCodeElement = `<a href="${discountResponseData.code}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">Discount Link</a>`
            } else {
                dicountCodeElement = discountResponseData.code;
            }
            tbodyElement.innerHTML += `<tr id="${discountResponseData.id}" class="row-${tableRowCount + index}">
                                                <td id="propfirm-logo${tableRowCount + index}">
                                                    <div>
                                                        <img class="propfirm-circular-image table-image" src="${discountResponseData.logo}" />
                                                    </div>
                                                </td>
                                                <td id="name${tableRowCount + index}">${discountResponseData.name}</td>
                                                <td id="discount${tableRowCount + index}">${discountResponseData.percentage}</td>
                                                <td id="discount-code${tableRowCount + index}">${dicountCodeElement}</td>
                                                <td id="link${tableRowCount + index}">
                                                    <a href="${discountResponseData.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                                                        <button id="link-url${tableRowCount + index}" class="transparent-button table-button">Website</button>
                                                    </a>
                                                </td>
                                                ${isAdminFlag ? `
                                                <td class="button-td">
                                                    <button id="edit-button${tableRowCount + index}" class="transparent-button table-button edit-button">Edit</button>
                                                    <button id="save-button${tableRowCount + index}" class="transparent-button table-button save-button" style="display: none;">Save</button>
                                                    <button id="delete-button${tableRowCount + index}" class="transparent-button table-button delete-button">Delete</button>
                                                </td>` : ''}
                                            </tr>`;
        }
        isAdminFlag ? document.querySelectorAll(`.edit-button`).forEach(editButton => editButton.addEventListener('click', editRow, false)) : undefined;
        isAdminFlag ? document.querySelectorAll(`.save-button`).forEach(saveButton => saveButton.addEventListener('click', saveRow, false)) : undefined;
        isAdminFlag ? document.querySelectorAll(`.delete-button`).forEach(deleteButton => deleteButton.addEventListener('click', deleteRow, false)) : undefined;
    });
}

function addRow(event) {
    let tableRowCount = document.querySelector(".discount-table").rows.length;
    let tbodyElement = document.querySelector('.discount-table tbody');
    tbodyElement.innerHTML += `<tr id="row${tableRowCount + 1}" class="row-${tableRowCount + 1}">
                                    <td id="propfirm-logo${tableRowCount + 1}"></td>
                                    <td id="name${tableRowCount + 1}"></td>
                                    <td id="discount${tableRowCount + 1}"></td>
                                    <td id="discount-code${tableRowCount + 1}"></td>
                                    <td id="link${tableRowCount + 1}"></td>
                                    <td class="button-td">
                                        <button id="edit-button${tableRowCount + 1}" class="transparent-button table-button edit-button">Edit</button>
                                        <button id="save-button${tableRowCount + 1}" class="transparent-button table-button save-button" style="display: none;">Save</button>
                                        <button id="delete-button${tableRowCount + 1}" class="transparent-button table-button delete-button">Delete</button>
                                    </td>
                                </tr>`
    document.querySelectorAll('.edit-button').forEach(button => button.addEventListener('click', editRow, false));
    document.querySelectorAll('.save-button').forEach(button => button.addEventListener('click', saveRow, false));
    document.querySelectorAll('.delete-button').forEach(button => button.addEventListener('click', deleteRow, false));
}

function editRow(event) {
    let rowElement = event.target.parentElement.parentElement
    let propFirmName = document.getElementById(`name${rowElement.rowIndex + 1}`).innerText;
    let discountValue = document.getElementById(`discount${rowElement.rowIndex + 1}`).innerText;
    let discountCode = document.querySelector(`#discount-code${rowElement.rowIndex + 1} a`) ? document.querySelector(`#discount-code${rowElement.rowIndex + 1} a`).href : document.getElementById(`discount-code${rowElement.rowIndex + 1}`).innerText;
    event.target.style.display = 'none';
    document.getElementById(`save-button${rowElement.rowIndex + 1}`).style.display = '';
    let propFirmAsyncObject = readPropFirms();
    document.getElementById(`name${rowElement.rowIndex + 1}`).innerHTML = `<select name="name" id="name-options${rowElement.rowIndex + 1}"><option value="" selected disabled>Select Prop Firm</option></select>`
    propFirmAsyncObject.then(propFirmResponse => {
        propFirmResponse.forEach(popFirmsResponseData => {
            document.getElementById(`name-options${rowElement.rowIndex + 1}`).innerHTML += `<option value="${popFirmsResponseData.name}">${popFirmsResponseData.name}</option>`
        });
        propFirmName ? document.getElementById(`name-options${rowElement.rowIndex + 1}`).value = propFirmName : undefined;
    });
    document.getElementById(`discount${rowElement.rowIndex + 1}`).innerHTML = `<input type="text" id="discount-field${rowElement.rowIndex + 1}" name="discount-field${rowElement.rowIndex + 1}" value="${discountValue}">`;
    document.getElementById(`discount-code${rowElement.rowIndex + 1}`).innerHTML = `<input type="text" id="discount-code-field${rowElement.rowIndex + 1}" name="discount-code-field${rowElement.rowIndex + 1}" value="${discountCode}">`;
    document.getElementById(`link${rowElement.rowIndex + 1}`).innerHTML = `<a href=""  target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                                                                                <button id="link-url${rowElement.rowIndex + 1}" class="transparent-button table-button">Website</button>
                                                                            </a>`;
    document.getElementById(`name${rowElement.rowIndex + 1}`).addEventListener('change', propfirmSelect, false);
}

function saveRow(event) {
    let rowElement = event.target.parentElement.parentElement;
    let propFirmName = document.getElementById(`name-options${rowElement.rowIndex + 1}`).value;
    let discountPercantage = document.getElementById(`discount-field${rowElement.rowIndex + 1}`).value;
    let discountCode = document.getElementById(`discount-code-field${rowElement.rowIndex + 1}`).value;
    if (propFirmName && discountPercantage && discountCode) {
        let upsertDiscountAsyncObject = rowElement.id.includes('row') ? createDiscount(propFirmName, discountPercantage, discountCode) : updateDiscount(rowElement.id, propFirmName, discountPercantage, discountCode);
        upsertDiscountAsyncObject.then(discountResponse => {
            if (discountResponse.status === true || discountResponse.status === 204) {
                document.getElementById(`name${rowElement.rowIndex + 1}`).innerHTML = '';
                document.getElementById(`name${rowElement.rowIndex + 1}`).innerText = propFirmName;
                document.getElementById(`discount${rowElement.rowIndex + 1}`).innerHTML = '';
                document.getElementById(`discount${rowElement.rowIndex + 1}`).innerText = discountPercantage;
                if (discountCode.match(new RegExp('^(?:http[s]*|www).|\/\/'))) {
                    document.getElementById(`discount-code${rowElement.rowIndex + 1}`).innerHTML = `<a href="${discountCode}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">Discount Link</a>`;
                } else {
                    document.getElementById(`discount-code${rowElement.rowIndex + 1}`).innerHTML = '';
                    document.getElementById(`discount-code${rowElement.rowIndex + 1}`).innerText = discountCode;
                }
                if (rowElement.id.includes('row')) {
                    rowElement.id = discountResponse.discountID;
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is created successfully`;
                } else {
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is updated successfully`;
                }
                event.target.style.display = 'none';
                document.getElementById(`edit-button${rowElement.rowIndex + 1}`).style.display = '';
            } else {
                if (rowElement.id.includes('row')) {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is creation failed`;
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is updation failed`;
                }
            }
        });
    } else {
        toastShortMessage.innerText = 'Failed';
        toastDetailedMessage.innerText = `You have not entered required fields in discount ${rowElement.rowIndex}`;
    }
    activeToast();
}

function deleteRow(event) {
    let rowElement = event.target.parentElement.parentElement;
    if (!rowElement.id.includes('row')) {
        let deleteDiscountAsyncObject = deleteDiscount(rowElement.id);
        deleteDiscountAsyncObject.then(discountResponse => {
            if (discountResponse.status === 204) {
                toastShortMessage.innerText = 'Success';
                toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is deleted successfully`;
                rowElement.remove();
            } else {
                toastShortMessage.innerText = 'Failed';
                toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is deletion failed`;
            }        
        });
    } else {
        toastShortMessage.innerText = 'Success';
        toastDetailedMessage.innerText = `Discount ${rowElement.rowIndex} is deleted successfully`;
        rowElement.remove();
    }
    activeToast();
}


function propfirmSelect(event) {
    let rowElement = event.target.parentElement.parentElement;
    let propFirmAsyncObject = readPropFirms(event.target.value, 'NAME');
    propFirmAsyncObject.then(propFirmResponse => {
        propFirmResponse.forEach(popFirmsResponseData => {
            document.getElementById(`propfirm-logo${rowElement.rowIndex + 1}`).innerHTML = `<div>
                                                                                                <img class="propfirm-circular-image table-image" src="${popFirmsResponseData.logo}" />
                                                                                            </div>`
            document.getElementById(`link-url${rowElement.rowIndex + 1}`).parentElement.href = popFirmsResponseData.url;
        });
    });
}

export { loadDiscount }