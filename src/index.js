import {data} from "/src/data.js";

const table = document.querySelector('.content-table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead');

function addRows() {
    data.forEach(row => {
        const tr = document.createElement('tr');
        // Making an array from given object
        const entries = Object.entries(row);

        //Getting each individual cell
        entries.forEach(cell => {
            const td = document.createElement('td');
            // Adding class names based on the rows names for further manipulations
            td.classList.add(`${cell[0]}`);
            td.textContent = cell[1];
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
    });
}

function clearRows() {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function loadTable() {
    return new Promise(function (resolve, reject) {
        addRow();
        resolve()
    });
}

function getListOfHeadings(thead) {
    const headers = thead.querySelectorAll('th');
    const list = [];
    headers.forEach(header => {
        list.push(header.textContent);
    });
    return list
}

function addAtribute(list, attribute) {
    list.forEach(el => {
        el.setAttribute(attribute, true);
    });
}

function multipleSelector(arrOfClasses) {
    let joinedElms = arrOfClasses.join(' ,');
    return document.querySelectorAll(joinedElms);
}

let loadTables = new Promise(function (resolve, reject) {
        addRows();
        //checking if each row has been uploaded
        if (tbody.children.length === data.length) {
            resolve()
        } else {
            reject('Rows have not been downloaded')
        };
    }).catch(err => alert(err))
    .then(() => {
        const selectedElms = multipleSelector(['.text', '.type', '.publish_date', '.publish_hour', '.is_paid', '.is_deleted']);
        addAtribute(selectedElms, 'contenteditable');
    });

// 1. Почему я не могу изменить данное свойство у ряда? Пришлось вместо этого пользоваться атрибутом contenteditable
// tds.forEach(td => td.isContentEditable = true);