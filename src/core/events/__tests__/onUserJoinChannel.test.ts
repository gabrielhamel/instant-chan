import { onUserJoinChannel } from "@core/events";
import { Channel, User, UserState } from "@core/ports";
import { ChannelRepository } from "@core/repositories";
import { describe, expect, it, vi } from "vitest";

describe("On user join a channel", () => {
  it("Should clone the channel from where the user come", async () => {
    const channelCloneMock = vi.fn();

    const channelRepository: ChannelRepository = {
      getById: vi.fn().mockReturnValue(
        Promise.resolve<Channel>({
          clone: channelCloneMock,
          getId: vi.fn(),
          getUsers: vi.fn<unknown[], User[]>().mockReturnValue([]),
        }),
      ),
    };

    const oldState: UserState = { getChannelId: vi.fn() };
    const newState: UserState = {
      getChannelId: vi.fn<unknown[], string>().mockReturnValue("channel-id-1"),
    };

    await onUserJoinChannel(channelRepository)(oldState, newState);

    expect(channelCloneMock).toHaveBeenCalledOnce();
  });

  it("Should move every members from the previous channel to the cloned one", async () => {
    const clonedChannel: Channel = {
      clone: vi.fn(),
      getId: vi.fn(),
      getUsers: vi.fn(),
    };

    const userToMove: User = {
      setChannel: vi.fn(),
    };

    const channelRepository: ChannelRepository = {
      getById: vi.fn().mockReturnValue(
        Promise.resolve<Channel>({
          clone: vi
            .fn<unknown[], Promise<Channel>>()
            .mockReturnValue(Promise.resolve(clonedChannel)),
          getId: vi.fn(),
          getUsers: vi.fn<unknown[], User[]>().mockReturnValue([userToMove]),
        }),
      ),
    };

    const oldState: UserState = { getChannelId: vi.fn() };
    const newState: UserState = {
      getChannelId: vi.fn().mockReturnValue("channel-id-1"),
    };

    await onUserJoinChannel(channelRepository)(oldState, newState);

    expect(userToMove.setChannel).toHaveBeenCalledWith(clonedChannel);
  });

  it("Should raise an error if the user didn't move to a new channel", async () => {
    const channelRepository: ChannelRepository = {
      getById: vi.fn(),
    };

    const oldState: UserState = {
      getChannelId: vi.fn(),
    };
    const newState: UserState = {
      getChannelId: vi.fn().mockReturnValue(null),
    };

    const call = () => onUserJoinChannel(channelRepository)(oldState, newState);
    await expect(call).rejects.toThrowError(
      "No channel associated to the user state",
    );
  });
});
