const  axios = require('axios')

var token2 = "";
axios.post('https://e2payments.explicador.co.mz/oauth/token',
    {
        grant_type: 'client_credentials',
        "client_id": "98cd2d3b-5e4f-42e0-8c93-d01fc871b858",
        "client_secret": "adazkz8CM456yLhzNQz4m3JOOmmFVEm3fHkrbDFh"
    }).then(function (response) {
   storeTokenInBrowser(response.data)
}).catch(function (err) {
    console.log('token error',err);
});

async function storeTokenInBrowser(responseData) {

    let token = responseData.token_type + ' ' + responseData.access_token;
    let expires = addDaysToToken(10); // validade de 10 dias
   document.cookie = "e2payment_token=" + (token || "")  + expires + "; path=/";
    token2 = token

}
async function addDaysToToken(totalDays) {

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    var date = new Date();

    return date.addDays(totalDays);

}


async function getToken() {

    var nameEQ = "e2payment_token=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;

}

var payloadE2b = {
    "client_id": "98cd2d3b-5e4f-42e0-8c93-d01fc871b858",
    "amount": "30", // no intervalo de 1 a 1250000
    "phone": "846411171", //9 digitos
    "reference": "PrimeiroPagamento"
};

var wallet_id = 194622;// A carteira que deseja receber o dinheiro nela
var ENDPOINT_URL = "https://e2payments.explicador.co.mz/v1/c2b/mpesa-payment/" + wallet_id;

var header = {
    "Authorization": getToken(),//Veja o exemplo 05
    "Accept": "application/json",
    "Content-Type": "application/json"
};

axios.post(ENDPOINT_URL, payloadE2b, {headers: header}).then(function (response) {
   console.log(response.data)// Transação realizada com sucesso.
    console.log("sucesso")
}).catch(function (err) {
    console.log('A transação falhou',err);
});

