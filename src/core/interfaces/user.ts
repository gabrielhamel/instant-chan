import { Channel } from "./channel";

export interface User {
  setVoiceChannel(channel: Channel): Promise<void>;
}
