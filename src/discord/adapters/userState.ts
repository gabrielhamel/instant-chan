import { UserState } from "@core/ports";
import { VoiceState as EncapsulatedUserState } from "discord.js";

export class DiscordUserState implements UserState {
  constructor(protected userState: EncapsulatedUserState) {}

  getChannelId() {
    return this.userState.channelId;
  }
}
