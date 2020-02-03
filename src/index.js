import { data } from "/src/data.js";

const table = document.querySelector('.content-table');
const tbody = table.querySelector('tbody');
const thead = table.querySelector('thead');

function addRow() {
    data.forEach(row => {
        const tr = document.createElement('tr');
        // Making an array from given object
        const entries = Object.entries(row);
    
        //Getting each individual cell
        entries.forEach(cell => {
            const td = document.createElement('td');
            // Need to create some sort of check here to place the value on the corresponding cell based on the heading of the row
            td.textContent = cell[1];
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
    });
}

function clearRows() {
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}

function loadTable() {
    return new Promise(function (resolve, reject) {
        addRow();
        resolve()
    });
}

function getListOfHeadings(thead){
    const headers = thead.querySelectorAll('th');
    const list = [];
    headers.forEach(header => {
        list.push(header.textContent);
    });
    return list
}

loadTable()
    .then(function () {
        const tds = document.querySelectorAll('td');
        tds.forEach(td => {
            td.setAttribute('contenteditable', true);
        });
    });

// trying different features


// document.addEventListener('DOMContentLoaded', addRow);
// tds.forEach(td => td.isContentEditable = true);

