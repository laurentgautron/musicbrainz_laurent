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
const message = document.querySelector('.message');

/* modal elements */
const modale = document.querySelector('.modale');
const modaleCross = document.querySelector('.modaleCross');
const modalList = document.querySelector('.modalList');
const coverList = document.querySelector('.coverList');
const modalMessage = document.querySelector('.modalMessage');
const modalTitle = document.querySelector('.modaltitle');
const modalAlbum = document.querySelector('.modalalbum');
let clickOnCross = false;

/* variables */

/*  for each array in headerTable:
    first element is column's title for the header table 
    other elements are path to get value in response  of request */
const headerTable = [
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
let recordingsMbid = [];
let releasesMbid = [];

/* same use as headerTable but to display modal elements */
const modalElementList = [
    ['genre', 'tags'], 
    ['durée', 'length'], 
    ['note', 'rating', 'value']];

/*  functions  */


/* on submit */
form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    anim.classList.add('loader');
    results.textContent = "";
    tableBody.innerHTML = "";
    buttonList.innerHTML = "";
    buttonList.style.display = "none";
    message.innerHTML = "";
    coverList.innerHTML = "";
    releasesMbid = [];
    recordingsMbid = []; 
    numberList = 1;
    if (searchedWord.value) {
        wordRequest(urlForRequest(searchedWord.value, searchedField.value), dispatchResultForTable, displayError, indexButtonActual);
    } else {
        anim.classList.remove('loader');
        message.textContent = "Le champ de recherche est vide !";
    }
})

/* to close modal window */
modaleCross.addEventListener('click', () => {
    clickOnCross = true;
    coverList.innerHTML = "";
    modalList.innerHTML = "";
    modale.setAttribute('hidden', '');
})


function addButtonAction(tableRow, offset) {
    const actionColumn = document.createElement('td');
    const actionColumnButton = document.createElement('button');
    actionColumnButton.addEventListener('click', () => {
        modale.removeAttribute('hidden');
        requestForModal(recordingsMbid[tableRow.children[0].textContent - 1 - offset], displayModal, tableRow, offset);
    })
    actionColumnButton.textContent = '+';
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

function dispatchResultForTable(response, indexButton, offset) {
    displayButton(numberList, indexButton);
    displayResult(response['recordings'], response['count'], offset);
    getRecordingsMbid(response['recordings']);
    getReleasesMbid(response['recordings']);
}
  

function displayTableHeader(headerTable) {
    /*  to display titles with the first item of headerTable */
    const newHeaderItem = document.createElement('th');
    newHeaderItem.textContent = "#";
    tableHead.appendChild(newHeaderItem);
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
function getItemText(itemArray, theRecording) {
    let text = theRecording;
        /* itemArray from 1 to the end is the path to get value  */
        for (let i = 1; i < itemArray.length; i++) {
            text = text[itemArray[i]];
            if (text === undefined) { return 'aucun'}
        }
    //}
    return text
}

function displayResult(response, count, offset) {
    buttonList.style.display = "flex";
    results.textContent = count.toString() + ' résultats';
    anim.classList.remove('loader');
    for(recording of response) {
        const newRow = document.createElement('tr');
        const rankItem = document.createElement('td');
        rankItem.textContent = offset + response.indexOf(recording) + 1;
        newRow.appendChild(rankItem);
        for (const item of headerTable) {
            const rowItem = document.createElement('td');
            rowItem.textContent = getItemText(item, recording);
            newRow.appendChild(rowItem);
        }
        addButtonAction(newRow, offset);
    }
}

function displayError(response) {
    anim.classList.remove('loader');
    console.log('pas');
    message.textContent = response;
}

function convert(data) {
    data = parseInt(data, 10);
    const secondes = Math.floor(data/1000)%60;
    const minutes = Math.floor(data/60000)%60;
    return minutes + ', ' + secondes
}

function displayModal(elementsForModal, tableRow, offset) {
    clickOnCross = false;
    modalMessage.textContent = "pas d'images pour ce titre";
    for (const element of headerTable) {
        const modalElement = document.createElement('li');
        modalElement.textContent = element[0] + " :";
        const elementHeaderContent = document.createElement('span');
        elementHeaderContent.textContent = tableRow.children[headerTable.indexOf(element) + 1].textContent;
        if (element[0] === 'Titre') {
            modalTitle.textContent = elementHeaderContent.textContent;
        } else if (element[0] === 'Album') {
            modalAlbum.textContent = elementHeaderContent.textContent;
        }
        modalElement.appendChild(elementHeaderContent);
        modalList.appendChild(modalElement);
    }
    for (const element of modalElementList) {
            const modalElement = document.createElement('li');
            modalElement.textContent = element[0] + " :";
            const elementContent = document.createElement('span');
            let content = getItemText(element, elementsForModal);
            if (content === null || content.length === 0) {
                content = "--";
            } else if (element[0] === 'genre') {
                let tagList = '';
                for (const tag of content) {
                    tagList += tag['name'] + ";";
                }
                content = tagList;
            } else if (element[0] === 'durée') {
                content = convert(content) + ' minutes';
            }
            elementContent.textContent = content;
            modalElement.appendChild(elementContent);
            modalList.appendChild(modalElement);
        }
    // there is an array of releases for each line of the table which content 0 or many releases 
    const releases = releasesMbid[tableRow.children[0].textContent - 1 - offset];
    if (releases) {
        for (const release of releases) {
            if (!clickOnCross) {
                requestForCover(release, addCover); 
            }
        }
    }
}

function addCover(images) {
    if (images !== 'aucune image') {
        for (const image of images) {
            const imageLi = document.createElement('li');
            const img = document.createElement('img');
            if (image['thumbnails'] && !clickOnCross) {
                img.setAttribute('src', image['thumbnails']['small']);
                imageLi.appendChild(img);
                coverList.appendChild(imageLi);
                modalMessage.textContent = "";
            }
        }
    }
}

function getReleasesMbid(recordings) {
    for (const recording of recordings) {
        let releasesForOneRecording = [];
        if (recording['releases']) {
            for (const release of recording['releases']) {
                releasesForOneRecording.push(release['id']);
            }
            releasesMbid.push(releasesForOneRecording);
        }
    }
}

/* to fill  recordingsMbid with MBID's recording */
function getRecordingsMbid(recordings) {
    for (const recording of recordings) {
        recordingsMbid.push(recording['id']);
    }
}

displayTableHeader(headerTable);
getOptions(options);
