import { GuildMember as EncapsulatedUser } from "discord.js";
import { Channel } from "../../core/ports/channel";
import { User } from "../../core/ports/user";

export class DiscordUser implements User {
  constructor(protected user: EncapsulatedUser) {}

  async setChannel(channel: Channel) {
    await this.user.voice.setChannel(channel.getId());
  }
}
