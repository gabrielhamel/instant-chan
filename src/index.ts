import { onUserJoinChannel } from "@core/events";
import { DiscordUserState } from "@discord/adapters";
import { DiscordChannelRepository } from "@discord/repositories";
import { Client, Events, GatewayIntentBits, VoiceState } from "discord.js";

void (async () => {
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
