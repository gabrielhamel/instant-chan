import { Channel } from "./channel";

export interface User {
  setChannel(channel: Channel): Promise<void>;
}
