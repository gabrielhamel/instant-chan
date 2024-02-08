import { Channel } from "./channel";

export interface VoiceState {
  getChannel(): Channel;
}
