const { SlashCommandBuilder, REST, Routes } = require('discord.js');

const bind = {
  data: new SlashCommandBuilder()
    .setName('bind')
    .setNameLocalization('fr', 'lier')
    .setDescription('Transform one vocal channel to a "channel duplicator"')
    .setDescriptionLocalization(
      'fr',
      'Transforme un canal vocal en duplicateur de canal',
    )
    .addChannelOption((channel) =>
      channel
        .setName('channel')
        .setNameLocalization('fr', 'canal')
        .setDescription('Channel you want to bind to instant-chan')
        .setDescriptionLocalization(
          'fr',
          'Le canal à ratacher au bot instant-chan',
        )
        .setRequired(true),
    ),
};

function subscribe(client) {
  client.commands.set(bind.data.name, bind);
}

function register(client, token) {
  const rest = new REST().setToken(token);
  return rest.put(Routes.applicationCommands(client.user.id), {
    body: [bind.data.toJSON()],
  });
}

module.exports = {
  subscribe,
  register,
};
