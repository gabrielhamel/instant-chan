import { Client } from "discord.js";
import { ChannelRepository } from "../../core/repositories/channel";
import { DiscordChannel } from "../adapters/channel";
import { DiscordChannelIncompatible } from "../exceptions/channelIncompatible";
import { DiscordChannelNotFound } from "../exceptions/channelNotFound";

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
