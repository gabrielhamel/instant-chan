import { VoiceState as EncapsulatedUserState } from "discord.js";
import { UserState } from "../../core/ports/userState";

export class DiscordUserState implements UserState {
  constructor(protected userState: EncapsulatedUserState) {}

  getChannelId() {
    return this.userState.channelId;
  }
}
