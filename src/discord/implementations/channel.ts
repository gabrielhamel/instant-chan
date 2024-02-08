import { VoiceBasedChannel as OriginalVoiceBasedChannel } from "discord.js";
import { Channel } from "../../core/interfaces/channel";
import { DiscordUser } from "./user";

export class DiscordVoiceChannel implements Channel {
  constructor(protected guildVoiceChannel: OriginalVoiceBasedChannel) {}

  getUsers() {
    return this.guildVoiceChannel.members.map(
      (member) => new DiscordUser(member),
    );
  }

  async clone() {
    const newChannel = await this.guildVoiceChannel.clone();

    return new DiscordVoiceChannel(newChannel);
  }

  get encapsulated() {
    return this.guildVoiceChannel;
  }
}
