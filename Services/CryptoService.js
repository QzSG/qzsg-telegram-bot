const fetch = require('node-fetch');

module.exports = {
    getCryptoPrice: async function (crypto) {
        switch (crypto) {
            //Ethereum
            case "eth":
                return this.fetchETHPrice();
            //Bitcoin
            case "btc":
                return this.fetchBTCPrice();
            //Bitcoin Cash
            case "bch":
                return this.fetchBCHPrice();
            //Litecoin
            case "ltc":
                return this.fetchLTCPrice();
            default:
                return this.fetchETHPrice();
        }
    },
    fetchETHPrice: async function () {
        let response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&e=coinbase');
        let data = await response.json();
        return data;
    },
    fetchBTCPrice: async function () {
        let response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&e=coinbase');
        let data = await response.json();
        return data;
    },
    fetchBCHPrice: async function () {
        let response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=BCH&tsyms=USD&e=coinbase');
        let data = await response.json();
        return data;
    },
    fetchLTCPrice: async function () {
        let response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD&e=coinbase');
        let data = await response.json();
        return data;
    },
    getShortName: function (crypto) {
        switch (crypto) {
            case "ethereum":
                return "ETH";
            case "bitcoin":
                return "BTC";
            case "litecoin":
                return "LTC";
            default:
                return "ETH";
        }
    }
};