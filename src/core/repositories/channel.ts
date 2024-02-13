import { Channel } from "../ports/channel";

export interface ChannelRepository {
  getById(id: string): Promise<Channel>;
}
