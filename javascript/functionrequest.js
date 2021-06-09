const nbButtonPerPage = 10;
let numberList = 1;
let nbListOfButton = 0;
let nbPages = 0;

function wordRequest(url, callbackResult, callbackModal, offset = 0, ) {
    const urlRequest = url + "&offset=" + offset;
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                if (response['recordings'].length !== 0) {
                    callbackResult(response['recordings'], response['count'], offset);
                    nbPages = Math.ceil(response['count']/25);
                    nbListOfButton = Math.ceil(nbPages/nbButtonPerPage);
                    callbackModal(response['recordings']);
                    if (buttonList.hidden) {
                        buttonList.removeAttribute('hidden');
                        displayButton(numberList);
                    }
                }
                else {
                    console.log('aucun résultat');
                }  
            }
            else {
                console.log('erreur: ', request.responseText);
            }
        }
    })
    request.send();
}

function requestForModal(mbid, callbackModal, row) {
    const urlRequest = "http://musicbrainz.org/ws/2/recording/" + mbid + "?inc=tags+ratings&fmt=json";
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                console.log('reeponse des modales: ', request.responseText)
                callbackModal(request.responseText, row);
            } else {
                console.log('pas de réponse');
            }
        }
    })
    request.send();
}