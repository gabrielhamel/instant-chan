import { Channel } from "@core/ports";
import { VoiceBasedChannel as EncapsulatedChannel } from "discord.js";
import { DiscordUser } from "./user";

export class DiscordChannel implements Channel {
  constructor(protected channel: EncapsulatedChannel) {}

  getUsers() {
    return this.channel.members.map((member) => new DiscordUser(member));
  }

  async clone() {
    const newChannel = await this.channel.clone();

    return new DiscordChannel(newChannel);
  }

  getId() {
    return this.channel.id;
  }
}
