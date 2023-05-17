const channelBounds = require('./binding').channelBounds
const utils =require('../utils/utils')
const bot = require('client')

// Create new channel  if parent is bound
//TODO => guild parameter not used
async function createNewChild(instantChannel, guild) {
    // Create the new child
    const child = await instantChannel.main.clone({
        name: `${instantChannel.name} #${instantChannel.childs.length + 1}`,
    });

    instantChannel.childs.push(child);

    child
        .setPosition(instantChannel.main.position + instantChannel.childs.length)
        .then(() => {})
        .catch(() => {});

    utils.updateStatus(instantChannel);

    // Move all members into the new channel
    instantChannel.main.members.forEach((member) => {
        member.voice.setChannel(child);
    });
}

function findInstantChanParent(childId) {
    let result = null;
    Object.keys(channelBounds).forEach((key) => {
        channelBounds[key].childs.forEach((child) => {
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

async function deleteChildChannel(parent, child) {
    // Delete in the array
    parent.childs = parent.childs.filter((elem) => elem.id !== child.id);
    try {
        await child.delete();
    } catch (err) {}
    utils.updateStatus(parent);
}

function initChannelManager(){
    bot.on('channelDelete', (deleted) => {
        const instantChan = channelBounds[deleted.id];
        if (instantChan !== undefined) {
            // Main instant chan deleted
            // delete all childs
            instantChan.childs.forEach((channel) => {
                channel
                    .delete()
                    .then((_) => {})
                    .catch((_) => {});
            });
            return;
        }
    });

// When a user join a channel
    bot.on('voiceStateUpdate', async (leaved, joined) => {
        // Check if user leave a channel
        if (leaved.channelId !== null) {
            // Channel leaved
            const parent = findInstantChanParent(leaved.channelId);
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
