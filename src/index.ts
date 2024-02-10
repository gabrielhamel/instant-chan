import { Client, Events, GatewayIntentBits, VoiceState } from "discord.js";
import dotenv from "dotenv";
import { DiscordUserState } from "./adapters/discord/userState";
import { onUserJoinChannel } from "./core/events/onUserJoinChannel";

void (async () => {
  dotenv.config();

  const discordClient = new Client({
    intents: GatewayIntentBits.GuildVoiceStates,
  });

  discordClient.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
      const oldUserState = new DiscordUserState(oldState);
      const newUserState = new DiscordUserState(newState);

      await onUserJoinChannel(oldUserState, newUserState);
    },
  );

  await discordClient.login(process.env.DISCORD_BOT_TOKEN);
})();
