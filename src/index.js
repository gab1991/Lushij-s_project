import {
    data, loadData
} from "/src/data.js";

let currentPage = 1;

async function getData(pageNumber, pageSize) {
    const offset = (pageNumber - 1) * pageSize;
    const data = await loadData(offset, pageSize)
        .then((data) => {
            if (data) {
                fillTable(data);
            }
        });
}

function drawTable(headers, parentEl, afterEl) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    headers.forEach(header => {
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

function countRowsToFetch() {
    // const thead = document.querySelector('th');
    const theadHeight = 40
    const rowHeight = 28; //setting default height of the row
    const tableDimensions = table.getBoundingClientRect(); // Getting the size of the table 
    const tOffsetAndHeight = tableDimensions.y;
    const freeSpaceBottom = 2 * rowHeight;
    const rowsToUpload = Math.floor(((window.innerHeight - (tOffsetAndHeight + theadHeight + freeSpaceBottom)) / rowHeight));
    return rowsToUpload;
}

function addRows(currentData) {
    currentData.forEach(row => {
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


function fillTable(currentData) {
    let loadTables = new Promise(function (resolve, reject) {
            clearRows();
            addRows(currentData);
            //checking if each row has been uploaded
            if (tbody.children.length === currentData.length) {
                resolve()
            } else {
                reject('Rows have not been downloaded')
            };
        }).catch(err => console.error(err))
        .then(() => {
            const selectedElms = multipleSelector(['.text', '.type', '.publishDate', '.publishHour', '.isPaid', '.isDeleted']);
            addAtribute(selectedElms, 'contenteditable');
        }).then(() => {
            // Adding "Save Button"
            const contEditblCells = document.querySelectorAll('[contenteditable]');
            contEditblCells.forEach(cell => cell.addEventListener("focus", displaySaveButton));
            contEditblCells.forEach(cell => cell.addEventListener("blur", hideSaveButton));
        });
};

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

//Pagination
function setUpPagination(data, rowsPerPage) {
    const wrapper = document.querySelector('.pagination')
    let pageCount = Math.ceil(data.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        if (i === 1 && pageCount > 1) {
            // Make first arrow button
            const button = createPaginationButton('<<');
            wrapper.appendChild(button);
        }
        if (pageCount > 10 && i === 2) {
            // Make the first 3dot button
            const button = createPaginationButton('. . .');
            wrapper.appendChild(button);
        }
        // Make usual buttons
        const button = createPaginationButton(i);
        wrapper.appendChild(button);

        if (pageCount > 10 && i === pageCount - 1) {
            // Make the las 3dot button
            const button = createPaginationButton('. . .');
            wrapper.appendChild(button);
        }

        if (i === pageCount && pageCount > 1) {
            // Make the last arrow button
            const button = createPaginationButton('>>');
            wrapper.appendChild(button);
        }
    }
}

function createPaginationButton(pageData) {
    const button = document.createElement('button');
    button.textContent = pageData;
    button.setAttribute('data-page', pageData);
    if (currentPage === pageData) button.classList.add('active');
    return button;
}

// Floating "save button" 
function displaySaveButton(e) {
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes'
    saveBtn.classList.add('saveBtn');

    const dimensions = e.target.getBoundingClientRect();
    saveBtn.style.top = `${dimensions.top}px`;
    saveBtn.style.left = `${dimensions.left + dimensions.width}px`;

    e.target.appendChild(saveBtn);
}

function hideSaveButton(e) {
    const saveBtn = document.querySelector('button.saveBtn');
    e.target.removeChild(saveBtn);
}

////////////////////////       Executable Part

//Get the headings from the currentData file
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

//Count how many rows might fit into the table

let pageSize = countRowsToFetch();
// console.log(pageSize);
setUpPagination(data, pageSize);

getData(1, pageSize);
// pageCashFiller(currentData);
// console.log(pageCash);

const btns = document.querySelectorAll('.pagination button');
btns.forEach(btn => btn.addEventListener('click', makeActive));

function makeActive() {
    let activeButton = document.querySelector('button.active');
    btns.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');

    const pageData = this.getAttribute('data-page');

    //fetch data that corresponds with the clicked number
    if (pageData === '<<') {
        if (activeButton === this.nextSibling) {
            this.classList.remove('active');
            activeButton.classList.add('active');
            return;
        }
        this.classList.remove('active');
        activeButton.previousSibling.classList.add('active');
        let pageNumber = activeButton.previousSibling.textContent;
        getData(pageNumber, pageSize);
        currentPage = pageNumber;
    } else if (pageData === '>>') {
        if (activeButton === this.previousSibling) {
            this.classList.remove('active');
            activeButton.classList.add('active');
            return;
        }
        this.classList.remove('active');
        activeButton.nextSibling.classList.add('active');
        let pageNumber = activeButton.nextSibling.textContent;
        getData(pageNumber, pageSize);
        currentPage = pageNumber;
    } else {
        let pageNumber = pageData;
        getData(pageNumber, pageSize);
        currentPage = pageNumber;
        fillTable();
    }

}

