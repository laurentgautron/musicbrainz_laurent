const buttonList = document.querySelector('.buttonList');
let indexButtonActual = 0;

function newPage(button) {
    if (button.className !== 'actualPage number ') {
        indexButtonActual = (!isNaN(button.textContent))? button.textContent : 0;
        anim.classList.add('loader');
        button.classList.add('actualPage');
        tableBody.innerHTML = "";
        recordingsMbid = [];
        releasesMbid = [];
        let offset = 0;
        if (!isNaN(button.textContent)) {
            offset = (parseInt(button.textContent, 10) - 1) * 25;
        } else {
            offset = 250 * (numberList - 1);
        }
        modalElements = [];
        buttonList.innerHTML = "";
        wordRequest(urlForRequest(searchedWord.value, searchedField.value), dispatchResultForTable, indexButtonActual, offset);
    }
}

function addLimitElement(node, elemetList) {
    for (const element of elemetList) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = element;
        li.appendChild(button);
        node.appendChild(li);
        if ((button.textContent === 'prev') || (button.textContent === 'next')) {
            button.classList.add(button.textContent);
            //displayButton(numberList);
            button.addEventListener('click', () => {
                numberList += (button.textContent === 'prev') ? -1 : 1 ;
                buttonList.innerHTML = "";
                newPage(button);
            })
        } else if ((parseInt(button.textContent, 10) === 1) || (parseInt(button.textContent, 10) === nbPages)) {
            button.classList.add('number');
            button.addEventListener('click', () => {
                buttonList.innerHTML = "";
                newPage(button);
            })
            
        } else {
            button.classList.add('dots');
        }
    }
}

function displayButton(numberList, indexButton) {
    if ((numberList > 1) && (numberList <= nbListOfButton)) {
        addLimitElement(buttonList, ['prev', 1, '...']);
    }
    for (let i = 1; i <= nbButtonPerPage; i++) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = i + (nbButtonPerPage * (numberList - 1));
        if (indexButton !== 0 && button.textContent === indexButton) {
            button.classList.add('actualPage');
        } else if (indexButton === 0 && i === 1){
            button.classList.add('actualPage');
        }
        button.classList.add('number');
        if (parseInt(button.textContent, 10) > nbPages) {
            break;
        } else {
            li.appendChild(button);
            buttonList.appendChild(li);
        }
        button.addEventListener('click', () => {
            newPage(button);
        })
    }
    if (numberList < nbListOfButton) {
        addLimitElement(buttonList, ['...', nbPages, 'next']);
    }
}