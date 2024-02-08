import { VoiceState as OriginalVoiceState } from "discord.js";
import { Channel } from "../../core/interfaces/channel";
import { VoiceState } from "../../core/interfaces/voiceState";
import { DiscordVoiceChannel } from "./channel";

export class DiscordVoiceState implements VoiceState {
  constructor(protected state: OriginalVoiceState) {}

  getChannel(): Channel {
    const channel = this.state.channel;

    if (!channel) {
      throw new Error(
        `VOICE_STATE_NULL_CHANNEL: No channel associated to the voice state ${this.state.id}`,
      );
    }

    return new DiscordVoiceChannel(channel);
  }
}
