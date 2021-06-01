/*encodeURIComponent(" AND type:album")*/

function urlForRequest(word, field) {
    console.log('le filed: ', field);
    if (field === "allfields") {
        console.log('je suis dans le if allfields');
        let url = "https://musicbrainz.org/ws/2/recording?query=";
        for (let i = 1; i < options.length; i++) {
            url = url + options[i] + ":\"" + word;
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
        const actionColumn = document.createElement('td');
        actionColumn.textContent = 'plus';  
        newRow.appendChild(actionColumn);
        tableBody.appendChild(newRow);
    }
}

displayTableHeader(headerTable);
getOptions(options);



