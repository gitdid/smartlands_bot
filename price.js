const StellarSdk = require("stellar-sdk");
const fetch = require("node-fetch");

const server = new StellarSdk.Server("https://horizon.stellar.org");

const accountKeypair = StellarSdk.Keypair.random();

const assetSLT = new StellarSdk.Asset(
    "SLT",
    "GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP",
);

var callback = function (resp) {
    var n = 0;
    var m = 0;
    var volumer = 1000;
    var volumer1 = volumer;
    var volumer2 = volumer;
    var getter1 = 0;
    var getter2 = 0;
    console.log(resp);
    var buyprice = 1 / resp.asks[0].price;
    var sellprice = 1 / resp.bids[0].price;
    console.log('Price buy:', buyprice);
    console.log('Price sell:', sellprice);


    console.log('------------------------------');
    console.log('');
    console.log('It looks you can sell', volumer1, 'SLT for', (volumer1 * buyprice), 'USD');
    console.log('It looks you can sell', volumer2, 'USD for', (volumer2 / sellprice), 'SLT');

    console.log('');
    console.log('In real you can sell SLT partially:');
    console.log('');

    while (volumer1 != 0) {
        var count = resp.asks[n].price * resp.asks[n].amount;
        if (volumer1 > count) {
            volumer1 = volumer1 - count;
            getter1 = getter1 + count / resp.asks[n].price;
            console.log(count, 'SLT for', count / resp.asks[n].price, 'USD')
            n = n + 1;
        } else {
            getter1 = getter1 + volumer1 / resp.asks[n].price;
            console.log(volumer1, 'SLT for', volumer1 / resp.asks[n].price, 'USD');
            console.log('');
            console.log('At all you will get', getter1, 'USD for', volumer, 'SLT')
            console.log('-------------------------------------------------------');
            console.log('');
            volumer1 = 0;
        }
    }
    console.log('');
    console.log('In real you can sell USD partially:');
    console.log('');
    while (volumer2 != 0) {
        var count = resp.bids[m].amount / resp.bids[m].price;
        if (volumer2 > count) {
            volumer2 = volumer2 - count;

            getter2 = getter2 + count * resp.bids[m].price;
            console.log(count, 'USD for', count * resp.bids[m].price, 'SLT')

            m = m + 1;
        } else {
            getter2 = getter2 + volumer2 * resp.bids[m].price;

            console.log(volumer2, 'USD for', volumer2 * resp.bids[m].price, 'SLT');
            console.log('');
            console.log('At all you will get', getter2, 'SLT for', volumer, 'USD')
            console.log('-------------------------------------------------------');
            console.log('');
            volumer2 = 0;
        }
    }


};

var es = server
    .orderbook(
        new StellarSdk.Asset(
            "USDC",
            "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
        ),
        new StellarSdk.Asset(
            "SLT",
            "GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP",
        ),
    )
    .cursor("now")
    .limit(100)
    .stream({
        onmessage: callback
    });
