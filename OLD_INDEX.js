require('dotenv').config();

const getenv = require('getenv');
const {
    Client,
    GatewayIntentBits,
    Events,
    Collection,
    ChannelType,
    PermissionFlagsBits,
} = require('discord.js');
















bot.on('ready', async () => {
    await require('./commands').register(bot, getenv('BOT_TOKEN'));

    bot.guilds.cache.forEach((guild) => {
        const instantChannelsRegistered = [];
        guild.channels.cache.forEach((channel) => {
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
            bindChannel(null, channel.id);
            instantChannelsRegistered.push(channel.name.replace(/ \(new\)$/gm, ''));
        });
        guild.channels.cache.forEach((channel) => {
            // Try all subscribed channels
            instantChannelsRegistered.forEach((registered) => {
                const regex = new RegExp(
                    `^${registered} #\\d+$`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                );
                if (channel.name.match(regex)) {
                    channel
                        .delete()
                        .then(() => {})
                        .catch(() => {});
                }
            });
        });
    });
});






