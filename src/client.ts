const {
    Client,
    Collection,
    GatewayIntentBits} = require("discord.js") ;
const getenv = require('getenv')

const bot = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
    ],
});

bot.commands = new Collection();

require('./commands').subscribe(bot);


// Connection to the bot
bot.login(getenv('BOT_TOKEN'));

module.exports = {
    bot
}