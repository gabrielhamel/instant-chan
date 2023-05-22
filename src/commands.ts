import {ChatInputCommandInteraction, PermissionFlagsBits} from "discord.js";
import { SlashCommandBuilder, REST, Routes } from 'discord.js';
import * as binding from './binding';

console.log()

const bind = {
    data: new SlashCommandBuilder()
        .setName('bind')
        .setNameLocalization('fr', 'lier')
        .setDescription('Transform one vocal channel to a "channel duplicator"')
        .setDescriptionLocalization(
            'fr',
            'Transforme un canal vocal en duplicateur de canal',
        )
        .addChannelOption((channel : any) =>
            channel
                .setName('channel')
                .setNameLocalization('fr', 'canal')
                .setDescription('Channel you want to bind to instant-chan')
                .setDescriptionLocalization(
                    'fr',
                    'Le canal à ratacher au bot instant-chan',
                )
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
};

async function execute(interaction : ChatInputCommandInteraction){
    if (interaction === undefined){
        return
    }
    if (
        interaction &&
        interaction.memberPermissions &&
        interaction.channel &&
        interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels) ===
        false
    ) {
        interaction.channel.send('Access denied');
        return;
    }
    const channelId = interaction?.options?.getChannel('channel')!.id;

    try {
        // console.log(require('./binding.module'))
        // console.log(binding);

        await require('./binding').bindChannel(null, channelId);
        interaction.reply({
            content: 'Success',
        });
    } catch (e) {
        console.error(e);
        interaction.reply({
            content: 'Error',
        });
    }
}

function subscribe(client : any) {
    client.commands.set(bind.data.name, bind);
}

function register(client : any, token : any) {
    const rest = new REST().setToken(token);
    return rest.put(Routes.applicationCommands(client.user.id), {
        body: [bind.data.toJSON()],
    });
}

module.exports = {
    subscribe,
    register,
    execute
};