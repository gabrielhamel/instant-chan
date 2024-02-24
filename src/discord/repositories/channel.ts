import { ChannelRepository } from "@core/repositories";
import { DiscordChannel } from "@discord/adapters";
import {
  DiscordChannelIncompatible,
  DiscordChannelNotFound,
} from "@discord/exceptions";
import { Client } from "discord.js";

export class DiscordChannelRepository implements ChannelRepository {
  constructor(protected client: Client) {}

  async getById(id: string) {
    const discordChannel = await this.client.channels.fetch(id);

    if (!discordChannel) {
      throw new DiscordChannelNotFound(id);
    }

    if (!discordChannel.isVoiceBased()) {
      throw new DiscordChannelIncompatible(discordChannel);
    }

    return new DiscordChannel(discordChannel);
  }
}
