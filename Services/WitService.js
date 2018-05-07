const { Wit } = require('node-wit');
const util = require('util');

const wit = new Wit({
    accessToken: process.env.WIT_TOKEN
});
module.exports = {
    message: async function (text) {
        let response = await wit.message(text);
        return response;
    },
    getEntities: async function (message) {
        let response = await this.message(message);
        let data = await response.entities;
        //console.dir(data);
        var entities = { 'count': 0 };

        for (const prop in data) {
            if (data[prop][0].confidence >= 0.5) {
                entities[prop] = data[prop][0].value;
                entities.count++;
            }
        }
        return entities;
    }
};