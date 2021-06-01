/* table element where add results*/
const tableResult = document.querySelector('.tableResult');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const selection = document.querySelector('select');

/* header element */
const results = document.querySelector('.results');
const anim = document.querySelector('.anim');

/* form element */
const form = document.querySelector('.musicform');
const searchedWord = document.querySelector('#requestfield');
const searchedField = document.querySelector('#field');

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
    ["Artiste", "artist"],
    ["Titre", "recording"],
    ["Album", "release"]
]
    

selection.addEventListener('change', () => {
    anim.textContent = 'Bonjour';
    results.textContent = "";
    tableBody.innerHTML = "";
    wordRequest(urlForRequest(searchedWord.value, searchedField.value), 0, displayResult);
})

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    anim.textContent = 'Bonjour';
    results.textContent = "";
    tableBody.innerHTML = "";
    wordRequest(urlForRequest(searchedWord.value, searchedField.value), 0, displayResult);
})

