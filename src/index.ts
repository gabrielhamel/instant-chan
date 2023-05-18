// Config
import * as constants from "constants";
import {
    ChatInputCommandInteraction,
    Guild,
    GuildBasedChannel,
    GuildChannel,
    Interaction,
    VoiceChannel
} from "discord.js";

require('dotenv').config()

// Import
const bindChannel = require('./binding').bindChannel
const bot = require('./client').bot
const execute = require('./commands').execute
const channelManager = require('./channelManager')


const getenv = require('getenv');
const {
    // Client,
    // GatewayIntentBits,
    Events,
    ChannelType,
    // Collection,
    // ChannelType,
    PermissionFlagsBits,
} = require('discord.js');

channelManager.initChannelManager()
bot.on('ready', async () => {
    await require('./commands').register(bot, process.env.BOT_TOKEN);

    bot.guilds.cache.forEach((guild : Guild) => {
        const instantChannelsRegistered : any = [];
        guild.channels.cache.forEach((channel : GuildBasedChannel ) => {
            if (channel.type !== ChannelType.GuildVoice) {
                return;
            }
            if (channel.name.match(/ \(new\)$/gm) === null) {
                return;
            }

            if (
                !channel
                    .permissionsFor(bot.user)
                    .has(PermissionFlagsBits.ManageChannels) ||
                !channel
                    .permissionsFor(bot.user)
                    .has(PermissionFlagsBits.MoveMembers) ||
                !channel.permissionsFor(bot.user).has(PermissionFlagsBits.ViewChannel)
            ) {
                return;
            }

            // is a previous bound channel
            console.log(bindChannel)
            bindChannel(null, channel.id);
            instantChannelsRegistered.push(channel.name.replace(/ \(new\)$/gm, ''));
        });
        guild.channels.cache.forEach((channel : GuildBasedChannel) => {
            // Try all subscribed channels
            instantChannelsRegistered.forEach(async (registered : any) => {
                const regex = new RegExp(
                    `^${registered} #\\d+$`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                );
                if (channel.name.match(regex)) {
                    await channel
                        .delete()
                }
            });
        });
    });
});

bot.on(Events.InteractionCreate, async (interaction : Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'bind') {
        execute(interaction)
    }
});