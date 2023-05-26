import {
    ApplicationCommand, ApplicationCommandManager,
    Client, Collection,
    GatewayIntentBits
} from "discord.js"

import * as logs from 'ts_logger/src'

export const bot = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
    ],
});
// console.log( bot.acte)


// require('./commands').subscribe(bot);

// Connection to the bot
bot.login(process.env.BOT_TOKEN).then(() =>  {
    logs.info("Client ready !")
});

