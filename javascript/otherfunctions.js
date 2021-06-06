/* table element where add results*/
const tableResult = document.querySelector('.tableResult');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const selection = document.querySelector('select');

/* form element */
const form = document.querySelector('.musicform');
const searchedWord = document.querySelector('#requestfield');
const searchedField = document.querySelector('#field');

/* page element */
const results = document.querySelector('.results');
const anim = document.querySelector('.anim');
const modale = document.querySelector('.modale');
const modaleCross = document.querySelector('.modaleCross');


/* main elements */
/*  for each array in headerTable:
    first element is column title for the header table 
    other elements are path to get value in response  of request */
const headerTable = [
    ["#","rank"],
    ["Artiste", "artist-credit", 0, "name"],
    ["Titre", "title"],
    ["Album", "releases", 0, "title"]
];

const options = [
    ["Tous les champs", "allfields"],
    ["Titre", "recording"],
    ["Album", "release"],
    ["Artiste", "artist"]
]

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    anim.textContent = 'Bonjour';
    results.textContent = "";
    tableBody.innerHTML = "";
    buttonList.innerHTML = "";
    buttonList.setAttribute('hidden', '');
    wordRequest(urlForRequest(searchedWord.value, searchedField.value), displayResult);
})

modaleCross.addEventListener('click', () => {
    modale.setAttribute('hidden', '');
})


function addButtonAction(tableRow) {
    const actionColumn = document.createElement('td');
    const actionColumnButton = document.createElement('button');
    actionColumnButton.addEventListener('click', () => {
        modale.removeAttribute('hidden');
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
            url = (i === options.length - 1) ? url : url + " OR ";
        }
        return url + "\"&fmt=json"
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

function getItemText(itemArray, index, theRecording, offset) {
    /*  to get the value for each column of tableHead*/
    let text = theRecording;
    if (itemArray[0] === '#') {
        text = offset + index + 1;
    } else {
        /* itemArray from 1 to the end is the path to get value  */
        for (let i = 1; i < itemArray.length; i++) {
            text = text[itemArray[i]];
            if (text === undefined) { return 'aucun'}
        }
    }
    return text
}

function displayResult(response, count, offset) {
    results.textContent = `${count} résultats`;
    anim.textContent = "";
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

displayTableHeader(headerTable);
getOptions(options);



