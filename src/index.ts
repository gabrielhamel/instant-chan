import { Client, Events, GatewayIntentBits, VoiceState } from "discord.js";
import dotenv from "dotenv";
import { onUserJoinChannel } from "./core/events/onUserJoinChannel";
import { DiscordUserState } from "./discord/adapters/userState";
import { DiscordChannelRepository } from "./discord/repositories/channel";

void (async () => {
  dotenv.config();

  const discordClient = new Client({
    intents: GatewayIntentBits.GuildVoiceStates,
  });

  const discordChannelRepository = new DiscordChannelRepository(discordClient);

  discordClient.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
      const oldUserState = new DiscordUserState(oldState);
      const newUserState = new DiscordUserState(newState);

      await onUserJoinChannel(discordChannelRepository)(
        oldUserState,
        newUserState,
      );
    },
  );

  await discordClient.login(process.env.DISCORD_BOT_TOKEN);
})();
