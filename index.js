// ****** SELECT ITEMS **********
const form = document.querySelector('.list-form');
const listCont = document.querySelector('.list-container');
const listPart = document.querySelector('.list-part');
const input = document.querySelector('.list-input');
const alert = document.querySelector('.alert');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');


// edit option
let editElement;
let editFlag = false;
let editId = "";
// ****** EVENT LISTENERS **********

document.addEventListener('DOMContentLoaded', setupItems);

//submit form
form.addEventListener('submit', addItem);

//clear items

clearBtn.addEventListener('click', clearItems);


// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = input.value;
    const id = new Date().getTime().toString();


    if (value && !editFlag) {
        const element = document.createElement('article');
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p>${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button  type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);


        element.classList.add('list-item');
        element.classList.add('flex');

        listCont.appendChild(element);
        listCont.classList.add('show');
        listPart.classList.add('show');
        addToLocalStorage(id, value);
        setBackToDefault();
        giveAlert('Element Added', 'success');
    } else if (value && editFlag) {
        editElement.textContent = input.value;
        giveAlert('Element changed', 'success');
        editLocalStorage(editId, value);
        setBackToDefault();
    } else {
        giveAlert('Please enter a text', 'error');
    }

};


// Clear items
function clearItems() {
    const elements = document.querySelectorAll('.list-item');
    if (elements.length > 0) {
        elements.forEach(function (element) {
            listCont.removeChild(element);
        });

        listPart.classList.remove('show');
        giveAlert('Items are cleared', 'error');
        setBackToDefault();
        localStorage.removeItem("list");
    }
}

//  delete item

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    listCont.removeChild(element);
    const elements = document.querySelectorAll('.list-item');
    if (elements.length === 0) {
        listPart.classList.remove('show');
    }
    setBackToDefault();
    giveAlert('Item deleted', 'error');
    removeFromLocalStorage(id);
}

// edit items

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editFlag = true;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    input.value = editElement.textContent;
    submitBtn.textContent = "Edit";
    editId = element.dataset.id;
}

//display alert

function giveAlert(text, type) {
    alert.textContent = text;
    alert.classList.add(`alert-${type}`);

    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${type}`);
    }, 1000)
};


// set back to default

function setBackToDefault() {
    editFlag = "";
    submitBtn.textContent = "Submit";
    input.value = "";
}
// ****** LOCAL STORAGE **********
// add to local storage

function addToLocalStorage(id, value) {
    const element = { id, value };
    const elements = getLocalStorage();
    elements.push(element);
    localStorage.setItem('list', JSON.stringify(elements));
}

//get local storage 

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
}


//remove from local storage

function removeFromLocalStorage(id) {
    let elements = getLocalStorage();
    elements = elements.filter(function (element) {
        if (element.id !== id) {
            return element;
        }
    })
    localStorage.setItem("list", JSON.stringify(elements));
}

// edit on local storage
function editLocalStorage(id, value) {
    let elements = getLocalStorage();
    elements = elements.map(function (element) {
        if (id === element.id) {
            element.value = value;
        }
        return element;
    })
    localStorage.setItem("list", JSON.stringify(elements));
}

// ****** SETUP ITEMS **********

function setupItems() {
    const elements = getLocalStorage();

    elements.forEach(function (item) {

        const element = document.createElement('article');
        const attr = document.createAttribute('data-id');
        attr.value = item.id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p>${item.value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button  type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
        const deleteBtn = element.querySelector('.delete-btn');
        const editBtn = element.querySelector('.edit-btn');
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);
        element.classList.add('list-item');
        element.classList.add('flex');
        listCont.appendChild(element);
    });

    listCont.classList.add('show');
    listPart.classList.add('show');

}