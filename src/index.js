import { data, loadData, postData } from '/src/data.js';

let currentPage = 1;

async function getData(pageNumber, pageSize) {
  let totalCount = 0;
  const offset = (pageNumber - 1) * pageSize;
  const data = await loadData(offset, pageSize);
  if (data.data) {
    fillTable(data.data);
  }
  return data;
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
  const theadHeight = 40;
  const rowHeight = 28; //setting default height of the row
  const tableDimensions = table.getBoundingClientRect(); // Getting the size of the table
  const tOffsetAndHeight = tableDimensions.y;
  const freeSpaceBottom = 2 * rowHeight;
  const rowsToUpload = Math.floor(
    (window.innerHeight - (tOffsetAndHeight + theadHeight + freeSpaceBottom)) /
      rowHeight
  );
  return rowsToUpload;
}

function addRows(currentData) {
  const editableClasses = [
    '.text',
    '.type',
    '.publishDate',
    '.publishHour',
    '.isPaid',
    '.isDeleted'
  ];
  currentData.forEach(row => {
    const tr = document.createElement('tr');
    // Making an array from given object
    const entries = Object.entries(row);

    //Getting each individual cell
    entries.forEach(cell => {
      const td = document.createElement('td');
      // Adding class names based on the rows names for further manipulations
      td.classList.add(`${cell[0]}`);
      td.setAttribute('data-colName', `${cell[0]}`);
      if (editableClasses.includes(`.${cell[0]}`)) {
        td.innerHTML = `<span>${cell[1]}</span>`;
      } else {
        td.textContent = cell[1];
      }
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
  let loadTables = new Promise(function(resolve, reject) {
    clearRows();
    addRows(currentData);
    //checking if each row has been uploaded
    if (tbody.children.length === currentData.length) {
      resolve();
    } else {
      reject('Rows have not been downloaded');
    }
  })
    .catch(err => console.error(err))
    .then(() => {
      const selectedElms = multipleSelector([
        '.text>span',
        '.type>span',
        '.publishDate>span',
        '.publishHour>span',
        '.isPaid>span',
        '.isDeleted>span'
      ]);
      addAtribute(selectedElms, 'contenteditable');
    })
    .then(() => {
      // Adding "Save Button"
      const contEditblCells = document.querySelectorAll('[contenteditable]');
      let txtCont;

      contEditblCells.forEach(cell => {
        cell.addEventListener('focus', function() {
          this.parentNode.classList.add('focus');
          txtCont = this.textContent;
        });
        cell.addEventListener('input', function() {
          displaySaveButton(this, txtCont);
        });
      });
      contEditblCells.forEach(cell =>
        cell.addEventListener('blur', function() {
          this.parentNode.classList.remove('focus');
          if (!this.getAttribute('data-saved')) this.textContent = txtCont;
          hideSaveButton(this);
        })
      );
    });
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
function setUpPagination(rowsPerPage, totalCount) {
  const wrapper = document.querySelector('.pagination');
  let pageCount = Math.ceil(totalCount / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 && pageCount > 1) {
      // Make first arrow button
      const button = createPaginationButton('<<');
      wrapper.appendChild(button);
    }
    // if (pageCount > 10 && i === 2) {
    //   // Make the first 3dot button
    //   const button = createPaginationButton(". . .");
    //   wrapper.appendChild(button);
    // }
    // Make usual buttons
    const button = createPaginationButton(i);
    wrapper.appendChild(button);

    // if (pageCount > 10 && i === pageCount - 1) {
    //   // Make the las 3dot button
    //   const button = createPaginationButton(". . .");
    //   wrapper.appendChild(button);
    // }

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
let saveBtn;

function displaySaveButton(that, txtCont) {
  if (that.parentNode.querySelector('button')) return;

  that.removeAttribute('data-saved');

  saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save Changes';
  saveBtn.classList.add('saveBtn');

  const dimensions = that.parentNode.getBoundingClientRect();
  saveBtn.style.top = `${dimensions.top}px`;
  saveBtn.style.left = `${dimensions.left + dimensions.width}px`;

  that.parentNode.appendChild(saveBtn);

  saveBtn.addEventListener('mousedown', function() {
    saveChanges(that, txtCont);
  });
}

function hideSaveButton(that) {
  if (that.parentNode.querySelector('.saveBtn')) {
    that.parentNode.removeChild(saveBtn);
  }
}

async function saveChanges(that) {
  that.setAttribute('data-saved', true);

  const id = that.parentNode.parentNode.querySelector('.id').textContent;
  const changedField = that.parentNode.getAttribute('data-colname');
  const txtCont = that.textContent;
  const sendObj = {
    id: id,
    [changedField]: txtCont
  };

  const sending = await postData(sendObj);
  console.log(sending);
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

// Main execution
getData(1, pageSize)
  .then(data => setUpPagination(pageSize, data.totalCount))
  .then(() => {
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
      } else {
        let pageNumber = pageData;
        getData(pageNumber, pageSize);
      }
    }
  });
