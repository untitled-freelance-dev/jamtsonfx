import { activeToast, inputFieldSelector } from "./component.js";
import { createPropFirm, updatePropFirm, readPropFirms, deletePropFirm } from "./api.js";

let toastShortMessage, toastDetailedMessage, propFirmBlogsElement;

function loadPropFirmBlogs(isAdmin) {
    propFirmBlogsElement = document.getElementById('prop-firm-blogs');
    let propFirmEditButton = document.getElementById('prop-firm-edit');
    let propFirmSubmitButton = document.getElementById('prop-firm-submit');
    let propFirmDeleteButton = document.getElementById('prop-firm-delete');
    let propFirmViewDiv = document.querySelector('.view');
    let propFirmlogoUpload = document.getElementById('logo-upload');
    if (isAdmin) {
        toastShortMessage = document.querySelector('.short-message');
        toastDetailedMessage = document.querySelector('.detailed-message');
        propFirmEditButton.removeAttribute('style');
        propFirmDeleteButton.removeAttribute('style');
        propFirmEditButton.addEventListener('click', editPropFirmBlog, false);
        propFirmSubmitButton.addEventListener('click', savePropFirmBlog, false);
        propFirmDeleteButton.addEventListener('click', deleteContent, false);
        propFirmViewDiv.addEventListener('click', selectLogo, false);
        propFirmlogoUpload.addEventListener('change', uploadLogo, false);
        inputFieldSelector('list');
    } else {
        propFirmBlogsElement.querySelector('script').remove();
        document.querySelector('.prop-firm-main-editor').remove();
        document.querySelector('.prop-firm-container').remove();
    }
    if (propFirmBlogsElement.className !== 'edit') {
        showPropFirmBlog(propFirmBlogsElement.className);
    }
}

function editPropFirmBlog(event) {
    if (propFirmBlogsElement.className !== 'edit') {
        let propFirmMainHolder = document.querySelector('.propfirm-main');
        document.getElementById('prop-firm-name').value = propFirmMainHolder.querySelector('.prop-firm-basic-info h1').innerText;
        document.getElementById('prop-firm-name').classList.add('has-text');
        document.getElementById('prop-firm-url').value = propFirmMainHolder.nextElementSibling.href;
        document.getElementById('prop-firm-url').classList.add('has-text');
        document.getElementById('prop-firm-details').value = propFirmMainHolder.querySelector('.prop-firm-basic-info p').innerText ? propFirmMainHolder.querySelector('.prop-firm-basic-info p').innerText : '';
        document.getElementById('prop-firm-details').classList.add('has-text');
        let blogDivELement = document.getElementById("body").innerHTML;
        // tinymce.activeEditor.setContent(blogDivELement);
        joditEditor.value = blogDivELement;
        document.querySelector('.prop-firm-blogs-main').style.display = 'none'
    }
    document.getElementById('prop-firm-submit').style.display = '';
    document.getElementById('prop-firm-editor').style.display = '';
    event.target.style.display = 'none';
    document.getElementById('prop-firm-delete').style.display = 'none';
}

function savePropFirmBlog(event) {
    // let blogContent = tinymce.activeEditor.getContent();
    let blogContent = joditEditor.value;
    let formHandle = document.getElementById("prop-firm-form");
    if (propFirmBlogsElement.className === 'edit') {
        if (formHandle.checkValidity()) {
            let createPropFirmAsyncObject = createPropFirm(formHandle, blogContent);
            createPropFirmAsyncObject.then(propFirmResponse => {
                if (propFirmResponse.status) {
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Prop Firm ${formHandle.name.value} is created successfully`;
                    let windowUrl = window.location.href;
                    windowUrl = window.location.href.replace(new RegExp('(?<=prop-firms).*'), `/${formHandle.name.value}`);
                    window.location.href = windowUrl;
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Prop Firm ${formHandle.name.value} creation Failed`;
                }
            });
            // tinymce.activeEditor.setContent('');
            joditEditor.value = '';
            document.getElementById('prop-firm-editor').style.display = 'none';
            document.getElementById('propfirm-edit').style.display = '';
            document.getElementById('propfirm-delete').style.display = '';
            document.getElementById('propfirm-submit').style.display = 'none';
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = 'You have not entered required fields'
        }
    } else {
        if (formHandle.name.value && formHandle.url.value) {
            let updatePropFirmAsyncObject = updatePropFirm(formHandle, blogContent);
            updatePropFirmAsyncObject.then(propFirmResponse => {
                if (propFirmResponse.status === 204) {
                    toastShortMessage.innerText = 'Success';
                    toastDetailedMessage.innerText = `Prop Firm ${formHandle.name.value} is updated successfully`;
                    let propFirmsBlogHolder = document.querySelector('.prop-firm-blogs-main');
                    let propFirmsBlogBody = document.querySelector('.prop-firm-main-body');
                    propFirmsBlogHolder.innerHTML = '';
                    propFirmsBlogHolder.appendChild(propFirmsBlogBody);
                    showPropFirmBlog(propFirmBlogsElement.className);
                } else {
                    toastShortMessage.innerText = 'Failed';
                    toastDetailedMessage.innerText = `Prop Firm ${formHandle.name.value} updation Failed`;
                }
            });
            // tinymce.activeEditor.setContent('');
            joditEditor.value = '';
            document.getElementById('prop-firm-editor').style.display = 'none';
            document.getElementById('propfirm-edit').style.display = '';
            document.getElementById('propfirm-delete').style.display = '';
            document.getElementById('propfirm-submit').style.display = 'none';
        } else {
            toastShortMessage.innerText = 'Failed';
            toastDetailedMessage.innerText = 'You have not entered required fields'
        }
    }
    activeToast();
}

function showPropFirmBlog(propFirmName) {
    let propFirmAsyncObject = readPropFirms(propFirmName, 'NAME')
    propFirmAsyncObject.then(propFirmResponse => {
        if (propFirmResponse) {
            let propFirmsBlogHolder = document.querySelector('.prop-firm-blogs-main');
            let propFirmsBlogBody = document.querySelector('.prop-firm-main-body');
            propFirmsBlogHolder.style.display = 'block';
            propFirmResponse.forEach(popFirmsResponseData => {
                propFirmsBlogBody.innerHTML = popFirmsResponseData.blog_content
                propFirmsBlogHolder.innerHTML = `<div class="propfirm-main">
                                                    <div>
                                                        <img class="propfirm-circular-image" src="${popFirmsResponseData.logo}" />
                                                    </div>
                                                    <div class="prop-firm-basic-info">
                                                        <h1>${popFirmsResponseData.name}</h1>
                                                        <p>${popFirmsResponseData.summary ? popFirmsResponseData.summary : ''}</p>
                                                    </div>
                                                </div>
                                                <a href="${popFirmsResponseData.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none">
                                                    <button class="propfirm-btn transparent-button card-btn">Visit Now</button>
                                                </a>` + propFirmsBlogHolder.innerHTML;
            });
        }
    });
}

function deleteContent(event) {
    if (propFirmBlogsElement.className !== 'edit') {
        let deletePropFirmAsyncObject = deletePropFirm(propFirmBlogsElement.className);
        deletePropFirmAsyncObject.then(propFirmResponse => {
            if (propFirmResponse.status === 204) {
                let propFirmName = document.querySelector('.prop-firm-basic-info>h1').textContent
                toastShortMessage.innerText = 'Success';
                toastDetailedMessage.innerText = `${propFirmName} is deleted successfully`;
                let windowUrl = window.location.href;
                windowUrl = windowUrl.replace(new RegExp('(?<=prop-firms).*'), '');
                window.location.href = windowUrl;
            }
        });
    }
}

function selectLogo(event) {
    let uploadInput = document.querySelector('#logo-upload');
    if (uploadInput.value) {
        uploadInput.value = null;
        let uploadFileElementText = uploadInput.parentNode.querySelector('.text');
        uploadFileElementText.innerText = 'Prop Firm Logo';
        let viewElement = uploadInput.parentNode.querySelector('.view');
        viewElement.classList.remove('file-select');
    } else {
        uploadInput.click();
    }
}

function uploadLogo(event) {
    let input = event.target
    let fileName = input.files[0].name;
    let uploadFileElementText = input.parentNode.querySelector('.text');
    uploadFileElementText.innerText = `${fileName}`;
    let viewElement = input.parentNode.querySelector('.view');
    viewElement.classList.add('file-select');
}

export { loadPropFirmBlogs }