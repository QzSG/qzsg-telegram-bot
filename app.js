const Telegraf = require('telegraf');

const Markup = require('telegraf/markup');
const express = require('express');
const CryptoService = require('./Services/CryptoService');
const ConversionService = require('./Services/ConversionService');
const WitService = require('./Services/WitService');
const InstagramService = require('./Services/InstagramService');

const app = express();
const PORT = process.env.PORT || 5000;

const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bot.webhookCallback('/magic'));

bot.telegram.setWebhook('https://qzsg-telegram-bot.herokuapp.com/magic');

app.get('/', (req, res) => {
    res.redirect('https://telegram.me/QzSG_Bot');
});

bot.start((ctx) => {
    console.log('started:', ctx.from.id);
    var name = ctx.from.username || ctx.from.first_name;
    ctx.reply(`Welcome ${name}! 😊 `, Markup
        .keyboard([
            ['📈 Check ETH Price', '📈 Check BTC Price']
        ])
        .oneTime()
        .resize()
        .extra()
    );
    ctx.reply("You can also simply ask me your query 😛");
});

bot.command('help', (ctx) => {
    console.log('Running [Help] Command', ctx.from.id);
    var name = ctx.from.username || ctx.from.first_name;
    ctx.reply(`Hello ${name}! 😊 `, Markup
        .keyboard([
            ['📈 Check ETH Price', '📈 Check BTC Price']
        ])
        .oneTime()
        .resize()
        .extra()
    );
    ctx.replyWithMarkdown("I am a 🤖 bot that you can use to find out the latest 💲💲💲 price of your favorite cryptos.\n\nYou can simply ask me your question such as :\n\n_What is the price of eth?_");
});

const regex = new RegExp(/(https?:\/\/www\.)?instagram\.com(\/p\/[a-zA-Z0-9_-]+\/?)/i);
bot.context.regex = regex;
bot.hears(regex, async (ctx) => {
    var url = regex.exec(ctx.message.text);
    console.dir(url);
    if (url) {
        let res = await InstagramService.getLink(url[0]);
        if (res.type === "video") {
            ctx.replyWithVideo(res.link);
        }
        else if (res.type === "image") {
            ctx.replyWithPhoto(res.link);
        }
    }    
    else {
        ctx.replyWithMarkdown(`Sorry 🙇 Your request is currently not supported.`);
    }
});

//To be deprecated in the future
bot.hears('📈 Check ETH Price', async (ctx) => {
    console.log("Running [Check ETH Price] Button");
    let ethPrice = await CryptoService.fetchETHPrice();
    let value = await ConversionService.convertToSGD(ethPrice.USD);
    ctx.replyWithMarkdown(`*1 ETH is worth ~ SGD $${value.toFixed(2)}*\n\n*Source : Coinbase*\n_Updated :${new Date(Date.now()).toLocaleString('en-US', { timeZone: "Asia/Singapore" })}_`);
});

bot.hears('📈 Check BTC Price', async (ctx) => {
    console.log("Running [Check BTC Price] Button");
    let btcPrice = await CryptoService.fetchBTCPrice();
    let value = await ConversionService.convertToSGD(btcPrice.USD);
    ctx.replyWithMarkdown(`*1 BTC is worth ~ SGD $${value.toFixed(2)}*\n\n*Source : Coinbase*\n_Updated :${new Date(Date.now()).toLocaleString('en-US', { timeZone: "Asia/Singapore" })}_`);
});
//To be deprecated in the future

bot.on(['sticker', 'photo'], (ctx) => {
    console.log("Sticker received, replying thumbs up!");
    return ctx.reply('👍');
});

bot.on('text', async (ctx) => {
    console.log("Text :" + ctx.message.text);
    let entities = await WitService.getEntities(ctx.message.text);
    if (entities.count > 0) {
        //console.dir(entities);
        if (entities.intent === "getCryptoPrice" && entities.cryptocurrency) {
            let response = await CryptoService[entities.intent](entities.cryptocurrency);
            var amount = entities.number || 1;
            if (amount < 0) { amount *= -1; }
            console.dir(response);
            entities.currency = entities.currency || "SGD";
            ConversionService.convertToCurrency(response.USD, entities.currency).then(({ value, currency }) => {
                console.log(value, currency);
                var valueOfAmount = value * amount;
                ctx.replyWithMarkdown(`*${amount} ${entities.cryptocurrency.toUpperCase()} is worth ~ ${currency} $${valueOfAmount.toFixed(2)}*\n\n*Source : Coinbase*\n_Updated :${new Date(Date.now()).toLocaleString('en-US', { timeZone: "Asia/Singapore" })}_`);
            });

        }
        else {
            ctx.replyWithMarkdown(`Sorry 🙇 Your cryptocurrency is currently not supported.`);
        }
    }
    else {
        ctx.replyWithMarkdown(`Sorry 🙇 I have not learnt how to handle your request 😅\nI will note it down 📓 and train harder! 💪`);
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            brand: 'QzSG Bot',
            title: "QzSG Bot"
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.redirect('/');
});

app.listen(PORT, () => {

});