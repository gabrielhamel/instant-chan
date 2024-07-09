require("dotenv").config();

const getenv = require("getenv");
const {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
});

bot.commands = new Collection();

require("./commands").subscribe(bot);

const channelBounds = {};

const prefix = "!instant";

function isBound(channelId) {
  return channelBounds[channelId] !== undefined;
}

async function bind(channel) {
  channelBounds[channel.id] = {
    name: channel.name.replace(/ \(new\)$/gm, ""),
    main: channel,
    childs: [],
  };

  updateStatus(channelBounds[channel.id]);
}

async function updateStatus(instantChannel) {
  if (instantChannel.main.name !== `${instantChannel.name} (new)`) {
    try {
      await instantChannel.main.setName(`${instantChannel.name} (new)`);
    } catch (e) {
      console.log("Can't set name of ", instantChannel.main);
    }
  }

  // TODO
  let index = 1;
  instantChannel.childs.forEach(async (child) => {
    try {
      await child.setName(`${instantChannel.name} #${index++}`);
    } catch (e) {
      console.log("Can't set name of ", child);
    }
  });
}

async function createNewChild(instantChannel, guild) {
  // Create the new child
  const child = await instantChannel.main.clone({
    name: `${instantChannel.name} #${instantChannel.childs.length + 1}`,
  });

  channelBounds[instantChannel.childs.push(child)];

  child
    .setPosition(instantChannel.main.position + instantChannel.childs.length)
    .then(() => {})
    .catch(() => {});

  updateStatus(instantChannel);

  // Move all members into the new channel
  instantChannel.main.members.forEach((member) => {
    member.voice.setChannel(child);
  });
}

async function bindChannel(res, channelId) {
  if (channelId === undefined) {
    if (res !== null) {
      res.send("Please specify a channel ID !");
    }
    return null;
  }

  // Get the concerned channel
  let channel;
  try {
    channel = await bot.channels.fetch(channelId);
  } catch (err) {
    if (res !== null) {
      res.send("Channel not found ! ");
    }
    return null;
  }

  if (channel.type !== ChannelType.GuildVoice) {
    if (res !== null) {
      res.send("This is not a voice channel !");
    }
    return null;
  }

  // Is already bound ?
  if (isBound(channelId) === true) {
    if (res !== null) {
      res.send("This channel is already bound !");
    }
    return channelBounds[channelId];
  }

  // Remove parenthesis
  channel.name = channel.name.replace(/ \(new\)$/gm, "");

  // Bind him
  await bind(channel);

  if (res !== null) {
    res.send(`Instant channel **${channel.name}** bound !`);
  }
  return channelBounds[channelId];
}

function help(res) {
  res.send(
    `**${prefix} bind <channelId>**: Transform a channel into an cloneable instance.`,
  );
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
  updateStatus(parent);
}

bot.on("ready", async () => {
  await require("./commands").register(bot, getenv("BOT_TOKEN"));

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
      instantChannelsRegistered.push(channel.name.replace(/ \(new\)$/gm, ""));
    });
    guild.channels.cache.forEach((channel) => {
      // Try all subscribed channels
      instantChannelsRegistered.forEach((registered) => {
        const regex = new RegExp(
          `^${registered} #\\d+$`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
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

bot.on("channelDelete", (deleted) => {
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
bot.on("voiceStateUpdate", async (leaved, joined) => {
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

bot.on("message", async (obj) => {
  const user = obj.author;

  // To avoid chain reaction
  if (user.bot === true) {
    return;
  }

  const msg = obj.content;

  // Not a command for me
  if (msg.startsWith(`${prefix}`) === false) {
    return;
  }

  const args = msg.split(" ");

  switch (args[1]) {
    case "help":
      await help(obj.channel);
      break;
    // Disabled for permissions
    case "bind":
      if (
        obj.member.permissions.has(PermissionFlagsBits.ManageChannels) === false
      ) {
        obj.channel.send("Access denied");
        break;
      }
      bindChannel(obj.channel, args[2]);
      break;
    default:
      obj.channel.send(
        `Invalid command. Type **${prefix} help** for more informations.`,
      );
  }
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "bind") {
    if (
      interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels) ===
      false
    ) {
      obj.channel.send("Access denied");
      return;
    }
    const channelId = interaction.options.getChannel("channel").id;

    try {
      await bindChannel(null, channelId);
      interaction.reply({
        content: "Success",
      });
    } catch (e) {
      console.error(e);
      interaction.reply({
        content: "Error",
      });
    }
  }
});

bot.login(getenv("BOT_TOKEN"));
