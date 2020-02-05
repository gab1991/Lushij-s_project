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

function countRowsToFetch() {
    // const thead = document.querySelector('th');
    const theadHeight = 40
    const rowHeight = 28; //setting default height of the row
    const tableDimensions = table.getBoundingClientRect();   // Getting the size of the table 
    const tOffsetAndHeight = tableDimensions.y;
    const freeSpaceBottom = 2 * rowHeight;
    const rowsToUpload = Math.floor(((window.innerHeight - (tOffsetAndHeight + theadHeight + freeSpaceBottom)) / rowHeight));
    return rowsToUpload;    
}

function getData(pageNumber, pageSize) {
    const pageData = [];
    let startpoint = (pageNumber-1) * pageSize;
    let endpoint = (startpoint + pageSize) - 1;
    console.log(data.length)
    for (let i = startpoint; endpoint >= i; i++) {
        if(data[i]) {
            pageData.push(data[i]);
        } else {
            console.error(`No data to fill the whole page`);
        }
        
    }
    return pageData;
}

function pageCashFiller(listRows) {
    return pageCash.push([listRows]);
}

function addRows() {
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
        const button = createPaginationButton(i);
        wrapper.appendChild(button);
    }
}

function createPaginationButton(page) {
    const button = document.createElement('button');
    button.textContent = page;
    if(currentPage === page) button.classList.add('active');
    return button;
}

function makeActive() {
    btns.forEach( btn => btn.classList.remove('active'));
    this.classList.add('active');
    //fetch data that corresponds with the clicked number
    let pageNumber = this.textContent;
    
    let currentData = getData(pageNumber, pageSize);
    loadTables();
   
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
console.log(pageSize);

// Fetch the data from data module
let pageIndex = 0;
let pageCash = [];
let currentData = getData(1,pageSize);
pageCashFiller(currentData);
// console.log(pageCash);

(function loadTable() {
 let loadTables = new Promise(function (resolve, reject) {
        addRows();
        //checking if each row has been uploaded
        if (tbody.children.length === currentData.length) {
            resolve()
        } else {
            reject('Rows have not been downloaded')
        };
    }).catch(err => console.error(err))
    .then(() => {
        const selectedElms = multipleSelector(['.text', '.type', '.publish_date', '.publish_hour', '.is_paid', '.is_deleted']);
        addAtribute(selectedElms, 'contenteditable');
    });
})();

    //pagintation
    let currentPage = 1;
    setUpPagination(data,pageSize);

    const btns = document.querySelectorAll('.pagination button');
    btns.forEach(btn => btn.addEventListener('click', makeActive));