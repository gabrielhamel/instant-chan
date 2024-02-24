import { Channel } from "discord.js";

export class DiscordChannelIncompatible extends Error {
  constructor(channel: Channel) {
    super(
      `Channel ${channel.id} of type ${channel.type} isn't compatible, only voice channel are allowed`,
    );
  }
}
