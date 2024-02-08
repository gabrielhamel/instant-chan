import { GuildMember as OriginalGuildMember } from "discord.js";
import { User } from "../../core/interfaces/user";
import { DiscordVoiceChannel } from "./channel";

export class DiscordUser implements User {
  constructor(protected guildMember: OriginalGuildMember) {}

  async setVoiceChannel(channel: DiscordVoiceChannel) {
    await this.guildMember.voice.setChannel(channel.encapsulated);
  }
}
