/* table elements where add results*/
const tableResult = document.querySelector('.tableResult');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const selection = document.querySelector('select');

/* form elements */
const form = document.querySelector('.musicform');
const searchedWord = document.querySelector('#requestfield');
const searchedField = document.querySelector('#field');

/* page elements */
const anim = document.querySelector('.anim span');
const results = document.querySelector('.results');

/* modal elements */
const modale = document.querySelector('.modale');
const modaleCross = document.querySelector('.modaleCross');
const modalList = document.querySelector('.modalList');

/* variables */

/*  for each array in headerTable:
    first element is column's title for the header table 
    other elements are path to get value in response  of request */
const headerTable = [
    ["#","rank"],
    ["Artiste", "artist-credit", 0, "name"],
    ["Titre", "title"],
    ["Album", "releases", 0, "title"]
];

/* options for the selections */
const options = [
    ["Tous les champs", "allfields"],
    ["Titre", "recording"],
    ["Album", "release"],
    ["Artiste", "artist"]
]

/* elements to fill modal page */
let modalElements = [];
/* same use as headerTable but to display modal elements */
const modalElementList = [
    ['id', 'id'], 
    ['titre', 'title'], 
    ['artiste'], 
    ['album'], 
    ['genre', 'tags'], 
    ['durée', 'length'], 
    ['note', 'rating']];

/*  functions  */


/* on submit */
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    anim.classList.add('loader');
    results.textContent = "";
    tableBody.innerHTML = "";
    buttonList.innerHTML = "";
    buttonList.setAttribute('hidden', '');
    numberList = 1;
    wordRequest(urlForRequest(searchedWord.value, searchedField.value), displayResult, getRecordingMbid);
})

/* to close modal window */
modaleCross.addEventListener('click', () => {
    modale.setAttribute('hidden', '');
})


function addButtonAction(tableRow) {
    const actionColumn = document.createElement('td');
    const actionColumnButton = document.createElement('button');
    actionColumnButton.addEventListener('click', () => {
        modalList.innerHTML = '';
        modale.removeAttribute('hidden');
        requestForModal(modalElements[tableRow.children[0].textContent - 1], displayModal, tableRow);
    })
    actionColumnButton.textContent = 'plus';
    actionColumn.appendChild(actionColumnButton);  
    tableRow.appendChild(actionColumn);
    tableBody.appendChild(tableRow);
}


function urlForRequest(word, field) {
    if (field === "allfields") {
        let url = "https://musicbrainz.org/ws/2/recording?query=";
        for (let i = 1; i < options.length; i++) {
            url = url + options[i][1] + ":\"" + word + "\"";
            url = (i === options.length - 1) ? url : url + encodeURIComponent(" OR ");
        }
        return url + "&fmt=json"
     } else {
        return "https://musicbrainz.org/ws/2/recording?query=" + field + ":\"" + word + "\"&fmt=json"
    }
}
  

function displayTableHeader(headerTable) {
    /*  to display titles with the first item of headerTable */
    for (const item of headerTable) {
        const newHeaderItem = document.createElement('th');
        newHeaderItem.textContent = item[0];
        tableHead.appendChild(newHeaderItem);
    }
    const actionTitle = document.createElement('th');
    actionTitle.textContent = "Action";
    tableHead.appendChild(actionTitle);
    tableResult.appendChild(tableHead);
}


/*  to fill select tag with options */
function getOptions(options) {
    for (const option of options) {
        const newOption = document.createElement('option');
        newOption.value = option[1]
        newOption.text = option[0];
        selection.appendChild(newOption);
    }
}

/*  to get the value for each column of tableHead*/
function getItemText(itemArray, index, theRecording, offset) {
    let text = theRecording;
    console.log('le recording: ', theRecording);
    if (itemArray[0] === '#') {
        text = offset + index + 1;
    } else {
        /* itemArray from 1 to the end is the path to get value  */
        for (let i = 1; i < itemArray.length; i++) {
            console.log('le item array: ', itemArray);
            console.log('élément de itemArray:', itemArray[i]);
            console.log('le texte: ', text[itemArray[i]]);
            text = text[itemArray[i]];
            if (text === undefined) { return 'aucun'}
        }
    }
    return text
}

function displayResult(response, count, offset) {
    results.textContent = `${count} résultats`;
    anim.classList.remove('loader');
    for(recording of response) {
        const newRow = document.createElement('tr');
        for (const item of headerTable) {
            const rowItem = document.createElement('td');
            rowItem.textContent = getItemText(item, response.indexOf(recording), recording, offset);
            newRow.appendChild(rowItem);
        }
        addButtonAction(newRow);
    }
}

function displayModal(elementsForModal, tableRow) {
    for (const element of modalElementList) {
        if (element[0] !== 'id') {
            const modalElement = document.createElement('li');
            const elementContent = document.createElement('span');
            if ((element[0] === 'artiste') || (element[0] === 'album')) {
                console.log('élément 0: ', element[0]);
                console.log('index de élément: ', modalElementList.indexOf(element));
                elementContent.textContent = (tableRow.children[modalElementList.indexOf(element) - 1].textContent)
            } else {
                elementContent.textContent = element[0] + ": " + getItemText(element, 0, elementsForModal, 0);
            }
            modalElement.appendChild(elementContent);
            modalList.appendChild(modalElement);
        }
    }
}

/* to fill  modalElements with MBID's recording */
function getRecordingMbid(recordings) {
    for (const recording of recordings) {
        modalElements.push(recording['id']);
    }
}

function getElementsForModal(response) {

}

displayTableHeader(headerTable);
getOptions(options);
