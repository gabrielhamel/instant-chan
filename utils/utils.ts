// Import
const constant = require('../const/const')

async function updateStatus(instantChannel : any) {
    if (instantChannel.main.name !== `${instantChannel.name} (new)`) {
        try {
            await instantChannel.main.setName(`${instantChannel.name} (new)`);
        } catch (e) {
            console.log("Can't set name of ", instantChannel.main);
        }
    }


    let index = 1;
    instantChannel.childs.forEach(async (child : any) => {
        try {
            await child.setName(`${instantChannel.name} #${index++}`);
        } catch (e) {
            console.log("Can't set name of ", child);
        }
    });
}

function help(res : any) {
    res.send(
        `**${constant.PREFIX} bind <channelId>**: Transform a channel into an cloneable instance.`,
    );
}

module.exports = {
    updateStatus,
    help
}