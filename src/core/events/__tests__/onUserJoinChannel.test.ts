import { onUserJoinChannel } from "@core/events";
import { Channel, User } from "@core/ports";
import { describe, expect, it, vi } from "vitest";
import { anyChannel, anyUserState, InMemoryChannelRepository } from "./utils";

describe("On user join a channel", () => {
  it("Should clone the channel from where the user come", async () => {
    const channelToClone: Channel = {
      ...anyChannel,
      clone: vi.fn(),
    };
    const channelRepository = new InMemoryChannelRepository({
      "channel-id-1": channelToClone,
    });

    await onUserJoinChannel(channelRepository)(anyUserState, {
      getChannelId: () => "channel-id-1",
    });

    expect(channelToClone.clone).toHaveBeenCalled();
  });

  it("Should move every members from the previous channel to the cloned one", async () => {
    const user: User = { setChannel: vi.fn() };
    const clonedChannel: Channel = anyChannel;
    const channelToClone = {
      ...anyChannel,
      clone: () => Promise.resolve(clonedChannel),
      getUsers: () => [user],
    };
    const channelRepository = new InMemoryChannelRepository({
      "channel-id-1": channelToClone,
    });

    await onUserJoinChannel(channelRepository)(anyUserState, {
      getChannelId: () => "channel-id-1",
    });

    expect(user.setChannel).toHaveBeenCalledWith(clonedChannel);
  });

  it("Should raise an error if the user leave a channel without joining a new one", async () => {
    const channelRepository = new InMemoryChannelRepository();

    const onUserLeave = () =>
      onUserJoinChannel(channelRepository)(anyUserState, {
        getChannelId: () => null,
      });

    await expect(onUserLeave).rejects.toThrowError(
      "No channel associated to the user state",
    );
  });

  it.todo(
    "Shouldn't create a new channel if the joined arent allowed to be cloneable",
  );
});
