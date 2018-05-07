const fetch = require('node-fetch');
const fx = require('money');
module.exports = {
    fetchUSDRates: async function () {
        let response = await fetch('https://api.fixer.io/latest?base=USD');
        let data = await response.json();
        //console.log(data);
        data.rates.USD = "1";
        fx.rates = data.rates;
    },
    convertToSGD: async function (value) {
        await this.fetchUSDRates();
        //console.log(value);
        return fx(value).from("USD").to("SGD");
    },
    convertToCurrency: async function (value, currency) {
        await this.fetchUSDRates();
        //console.log(value);
        //var currency = currency || "SGD";
        return { value: fx(value).from("USD").to(currency.toUpperCase()), currency: currency.toUpperCase() };
    }
};