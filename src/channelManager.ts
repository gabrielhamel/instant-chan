import {Guild} from "discord.js";

import {channelBounds} from './binding'
import {updateStatus} from '../utils/utils'
import {bot} from './client'

// Create new channel  if parent is bound
//TODO => guild parameter not used
async function createNewChild(instantChannel : any, guild : Guild) {
    // Create the new child
    const child = await instantChannel.main.clone({
        name: `${instantChannel.name} #${instantChannel.childs.length + 1}`,
    });

    instantChannel.childs.push(child);

    child
        .setPosition(instantChannel.main.position + instantChannel.childs.length)
        .then(() => {})
        .catch(() => {});

    updateStatus(instantChannel);

    // Move all members into the new channel
    instantChannel.main.members.forEach((member : any) => {
        member.voice.setChannel(child);
    });
}

function findInstantChanParent(childId : any) {
    let result : any = null;
    Object.keys(channelBounds).forEach((key : any) => {
        channelBounds[key].childs.forEach((child : any) => {
            if (childId === child.id) {
                result = { parent: channelBounds[key], child };
                return;
            }
        });
        if (result !== null) {
            return;
        }
    });
    return result;
}

async function deleteChildChannel(parent : any, child : any) {
    // Delete in the array
    parent.childs = parent.childs.filter((elem : any) => elem.id !== child.id);
    try {
        await child.delete();
    } catch (err) {}
    updateStatus(parent);
}

export function initChannelManager(){
    bot.on('channelDelete', (deleted : any) => {
        const instantChan = channelBounds[deleted.id];
        if (instantChan !== undefined) {
            // Main instant chan deleted
            // delete all childs
            instantChan.childs.forEach((channel : any) => {
                channel
                    .delete()
                    .finally()
            });
            return;
        }
    });

// When a user join a channel
    bot.on('voiceStateUpdate', async (leaved : any, joined : any) => {
        // Check if user leave a channel
        if (leaved.channelId !== null) {
            // Channel leaved
            const parent : any = findInstantChanParent(leaved.channelId);
            if (parent !== null) {
                // Check if the channel is empty
                if (parent.child.members.size === 0) {
                    // nobody left in the child channel
                    deleteChildChannel(parent.parent, parent.child);
                }
            }
        }

        // Check if user join a new channel
        if (!joined?.channelId) {
            return;
        }

        // Get and check the channel joined
        const instChannel = channelBounds[joined.channelId];
        if (instChannel === undefined) {
            return;
        }

        await createNewChild(instChannel, joined.guild);
    });
}

