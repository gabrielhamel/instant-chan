// Config
require('dotenv').config()

// Import
import * as logs from 'ts_logger/src'
import {
    Guild,
    GuildBasedChannel,
    Interaction, Role,
} from "discord.js";
import {bindChannel} from './binding'
import {bot} from './client'
import {execute} from './commands'
import {initChannelManager} from './channelManager'

import {
    Events,
    ChannelType,
    PermissionFlagsBits,
} from 'discord.js'


logs.initLogs()
initChannelManager()
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
                    .permissionsFor(guild.members.me!)
                    .has(PermissionFlagsBits.ManageChannels) ||
                !channel
                    .permissionsFor(guild.members.me!)
                    .has(PermissionFlagsBits.MoveMembers) ||
                !channel.permissionsFor(guild.members.me!).has(PermissionFlagsBits.ViewChannel)
            ) {
                return;
            }

            // is a previous bound channel

            logs.info(channel.id)
            logs.info(Number(channel.id))
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