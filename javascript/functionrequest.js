const nbButtonPerPage = 10;
let numberList = 1;
let nbListOfButton = 0;
let nbPages = 0;


/* get recordings for the word and option */
function wordRequest(url, callbackSucces, indexButton, offset = 0, ) {
    const urlRequest = url + "&offset=" + offset;
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                if (response['recordings'].length !== 0) {
                    nbPages = Math.ceil(response['count']/25);
                    nbListOfButton = Math.ceil(nbPages/nbButtonPerPage);
                    callbackSucces(response, indexButton, offset);
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

/*  get rating, tags and length on click button action*/
function requestForModal(mbid, callbackModal, row, offset) {
    const urlRequest = "http://musicbrainz.org/ws/2/recording/" + mbid + "?inc=tags+ratings&fmt=json";
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                callbackModal(JSON.parse(request.responseText), row, offset);
            } else {
                console.log('pas de réponse');
            }
        }
    });
    request.send();
}


function requestForCover(releasesMbid, callbackCover) {
    const urlRequest = "http://coverartarchive.org/release/" + releasesMbid;
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const rep = JSON.parse(request.responseText)['images'];
                callbackCover(rep);
            } else {
                callbackCover('aucune image');
            }
        }
    });
    request.send();
}