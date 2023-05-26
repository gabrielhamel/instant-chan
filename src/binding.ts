// Import
import {GuildBasedChannel} from "discord.js";
import * as logs from 'ts_logger/src'
import {ChannelType} from "discord.js"
import {bot} from './client'
import {updateStatus} from '../utils/utils'

// BDD TEMP parce que c'est de la merde :)
export const channelBounds : any = {};

// Check if one chanel is bound
function isBound(channelId : number) {
    return channelBounds[channelId] !== undefined;
}

// Save channel to bind in BDD
async function bind(channel : GuildBasedChannel) {
    logs.error("here")
    channelBounds[channel.id] = {
        name: channel.name.replace(/ \(new\)$/gm, ''),
        main: channel,
        childs: [],
    };

    updateStatus(channelBounds[channel.id]);
}

// Bind a channel
export async function bindChannel(res : any, channelId : number) {
    logs.info(channelId)
    logs.error(channelBounds)
    console.log(channelBounds)
    if (channelId === undefined) {
        if (res !== null) {
            res.send('Please specify a channel ID !');
        }
        return null;
    }

    // Get the concerned channel
    let channel;
    try {
        channel = await bot.channels.fetch(channelId.toString());
    } catch (err) {
        // console.log(err)
        logs.info(err)
        if (res !== null) {
            res.send('Channel not found ! ');
        }
        return null;
    }

    if (channel!.type !== ChannelType.GuildVoice) {
        logs.error("not voice")
        if (res !== null) {
            res.send('This is not a voice channel !');
        }
        return null;
    }

    // Is already bound ?
    if (isBound(channelId) === true) {
        logs.error("isbound")
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
    console.log(channelId)

    return channelBounds[channelId];
}
