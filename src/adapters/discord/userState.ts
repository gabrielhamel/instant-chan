import { VoiceState as EncapsulatedUserState } from "discord.js";
import { UserState } from "../../core/interfaces/userState";
import { DiscordChannel } from "./channel";

export class DiscordUserState implements UserState {
  constructor(protected userState: EncapsulatedUserState) {}

  getId() {
    return this.userState.id;
  }

  getChannel() {
    const channel = this.userState.channel;

    return channel ? new DiscordChannel(channel) : null;
  }
}
