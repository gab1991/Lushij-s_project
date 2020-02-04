import {data} from "/src/data.js";

function drawTable(headers, parentEl , afterEl) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    headers.forEach( header => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);        
    });
    
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    if (parentEl) parentEl.appendChild(table);
    if (afterEl) afterEl.after(table);
}

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

////////////////////////       Executable Part

//Get the headings from the data file
const headers = Object.keys(data[0]);

// Making the first letter capital
const headersUpper = [];
headers.forEach(header => {
    const headerUpper = header[0].toUpperCase() + header.slice(1);
    headersUpper.push(headerUpper);
});

// Draw the table
const body = document.querySelector('body');
const header = document.querySelector('header');

drawTable(headersUpper, body, header);

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

table.classList.add('content-table');

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

