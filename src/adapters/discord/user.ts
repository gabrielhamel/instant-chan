import { GuildMember as EncapsulatedUser } from "discord.js";
import { Channel } from "../../core/interfaces/channel";
import { User } from "../../core/interfaces/user";

export class DiscordUser implements User {
  constructor(protected user: EncapsulatedUser) {}

  async setChannel(channel: Channel) {
    await this.user.voice.setChannel(channel.getId());
  }
}
