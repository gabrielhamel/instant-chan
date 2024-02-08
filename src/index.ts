import { Client, Events, VoiceState } from "discord.js";
import { DiscordUserState } from "./adapters/discord/userState";
import { onUserJoinChannel } from "./core/events";

const bot = new Client({
  intents: 0,
});

bot.on(
  Events.VoiceStateUpdate,
  async (oldState: VoiceState, newState: VoiceState) => {
    const oldUserState = new DiscordUserState(oldState);
    const newUserState = new DiscordUserState(newState);

    await onUserJoinChannel(oldUserState, newUserState);
  },
);
