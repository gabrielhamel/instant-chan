import { Channel, UserState } from "@core/ports";
import { ChannelRepository } from "@core/repositories";

export class InMemoryChannelRepository implements ChannelRepository {
  constructor(protected channels: Record<string, Channel> = {}) {}

  getById(id: string) {
    return Promise.resolve(this.channels[id]);
  }
}

export const anyChannel: Channel = {
  clone: () => Promise.reject(),
  getId: () => "channel-id-1",
  getUsers: () => [],
};

export const anyUserState: UserState = { getChannelId: () => null };
