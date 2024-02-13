import { Channel, User } from "@core/ports";
import { GuildMember as EncapsulatedUser } from "discord.js";

export class DiscordUser implements User {
  constructor(protected user: EncapsulatedUser) {}

  async setChannel(channel: Channel) {
    await this.user.voice.setChannel(channel.getId());
  }
}
