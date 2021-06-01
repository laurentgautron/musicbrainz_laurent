function wordRequest(url, offset, callbackResult) {
    const urlRequest = url + "&offset=" + offset;
    let request = new XMLHttpRequest();
    request.open('GET', urlRequest);
    request.addEventListener('readystatechange', function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                if (response['recordings'].length !== 0) {
                    callbackResult(response['recordings'], response['count'], offset);
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