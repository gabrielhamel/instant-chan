import { Client, Events, VoiceState } from "discord.js";
import { handleVoiceStateUpdate } from "./core/events";
import { DiscordVoiceState } from "./discord/implementations/voiceState";

const bot = new Client({
  intents: 0,
});

bot.on(
  Events.VoiceStateUpdate,
  async (oldState: VoiceState, newState: VoiceState) => {
    const oldVoiceState = new DiscordVoiceState(oldState);
    const newVoiceState = new DiscordVoiceState(newState);

    await handleVoiceStateUpdate(oldVoiceState, newVoiceState);
  },
);
