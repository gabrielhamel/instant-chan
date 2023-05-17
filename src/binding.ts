// Import
import {GuildBasedChannel} from "discord.js";

const {ChannelType} = require("discord.js");
const client = require('./client')
const updateStatus = require('../utils/utils').updateStatus

// BDD TEMP parce que c'est de la merde :)
const channelBounds : any = {};

// Check if one chanel is bound
function isBound(channelId : number) {
    return channelBounds[channelId] !== undefined;
}

// Save channel to bind in BDD
async function bind(channel : GuildBasedChannel) {
    channelBounds[channel.id] = {
        name: channel.name.replace(/ \(new\)$/gm, ''),
        main: channel,
        childs: [],
    };

    updateStatus(channelBounds[channel.id]);
}

// Bind a channel
async function bindChannel(res : any, channelId : number) {
    if (channelId === undefined) {
        if (res !== null) {
            res.send('Please specify a channel ID !');
        }
        return null;
    }

    // Get the concerned channel
    let channel;
    try {
        channel = await client.bot.channels.fetch(channelId);
    } catch (err) {
        if (res !== null) {
            res.send('Channel not found ! ');
        }
        return null;
    }

    if (channel.type !== ChannelType.GuildVoice) {
        if (res !== null) {
            res.send('This is not a voice channel !');
        }
        return null;
    }

    // Is already bound ?
    if (isBound(channelId) === true) {
        if (res !== null) {
            res.send('This channel is already bound !');
        }
        return channelBounds[channelId];
    }

    // Remove parenthesis
    channel.name = channel.name.replace(/ \(new\)$/gm, '');

    // Bind him
    await bind(channel);

    if (res !== null) {
        res.send(`Instant channel **${channel.name}** bound !`);
    }
    return channelBounds[channelId];
}

// Exports
module.exports = {
    channelBounds,
    bindChannel
}