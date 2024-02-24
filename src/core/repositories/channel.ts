import { Channel } from "@core/ports";

export interface ChannelRepository {
  getById(id: string): Promise<Channel>;
}
