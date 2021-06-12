const buttonList = document.querySelector('.buttonList');

function newPage(button) {
    button.addEventListener('click', () => {
        if (button.className !== 'number actualPage') {
            const actual = buttonList.querySelector(".actualPage");
            actual.classList.remove('actualPage');
            button.classList.add('actualPage');
            tableBody.innerHTML = "";
            recordingsMbid = [];
            releasesMbid = [];
            const offset = (parseInt(button.textContent, 10) - 1) * 25
            modalElements = [];
            wordRequest(urlForRequest(searchedWord.value, searchedField.value), dispatchResultForTable, offset);
        }
    })
}

function addLimitElement(node, elemetList) {
    for (const element of elemetList) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = element;
        li.appendChild(button);
        node.appendChild(li);
        if ((button.textContent === 'Prev') || (button.textContent === 'Next')) {
            button.classList.add(button.textContent);
            button.addEventListener('click', () => {
                numberList += (button.textContent === 'Prev') ? -1 : 1 ;
                buttonList.innerHTML = "";
                tableBody.innerHTML = "";
                displayButton(numberList);
                const page = document.querySelector('.actualPage');
                const offset =(parseInt(page.textContent, 10) - 1) * 25;
                console.log('le offset: ', offset);
                wordRequest(urlForRequest(searchedWord.value, searchedField.value), dispatchResultForTable, offset);
            })
        } else if ((parseInt(button.textContent, 10) === 1) || (parseInt(button.textContent, 10) === nbPages)) {
            button.classList.add('number');
            newPage(button);
            if ((parseInt(button.textContent, 10) === nbPages)) {
                button.classList.add('lastPage');
            }
        } else {
            button.classList.add('dots');
        }
    }
}

function displayButton(numberList) {
    if ((numberList > 1) && (numberList <= nbListOfButton)) {
        addLimitElement(buttonList, ['Prev', 1, '...']);
    }
    for (let i = 1; i <= nbButtonPerPage; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = (numberList === 1) ? i : i + (nbButtonPerPage * (numberList - 1));
        button.classList.add('number');
        if (parseInt(button.textContent, 10) > nbPages) {
            break;
        } else {
            li.appendChild(button);
            buttonList.appendChild(li);
        }
        if (i === 1) {
            button.classList.add('actualPage');
        }
        newPage(button);
    }
    if (numberList < nbListOfButton) {
        addLimitElement(buttonList, ['...', nbPages, 'Next']);
    }
}