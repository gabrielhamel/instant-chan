import { describe, expect, it, vi } from "vitest";
import { Channel } from "../../interfaces/channel";
import { User } from "../../interfaces/user";
import { UserState } from "../../interfaces/userState";
import { onUserJoinChannel } from "../onUserJoinChannel";

describe("On user join a channel", () => {
  it("Should clone the channel from where the user come", async () => {
    const channelCloneMock = vi.fn();
    const oldState: UserState = { getChannel: vi.fn(), getId: vi.fn() };
    const newState: UserState = {
      getChannel: vi.fn<unknown[], Channel>().mockReturnValue({
        clone: channelCloneMock,
        getId: vi.fn(),
        getUsers: vi.fn<unknown[], User[]>().mockReturnValue([]),
      }),
      getId: vi.fn(),
    };

    await onUserJoinChannel(oldState, newState);

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

    const oldState: UserState = { getChannel: vi.fn(), getId: vi.fn() };
    const newState: UserState = {
      getChannel: vi.fn<unknown[], Channel>().mockReturnValue({
        clone: vi
          .fn<unknown[], Promise<Channel>>()
          .mockReturnValue(Promise.resolve(clonedChannel)),
        getId: vi.fn(),
        getUsers: vi.fn<unknown[], User[]>().mockReturnValue([userToMove]),
      }),
      getId: vi.fn(),
    };

    await onUserJoinChannel(oldState, newState);

    expect(userToMove.setChannel).toHaveBeenCalledWith(clonedChannel);
  });

  it("Should raise an error if the user didn't move to a new channel", async () => {
    const oldState: UserState = { getChannel: vi.fn(), getId: vi.fn() };
    const newState: UserState = {
      getChannel: vi.fn().mockReturnValue(null),
      getId: vi.fn(),
    };

    await expect(onUserJoinChannel(oldState, newState)).rejects.toThrowError(
      /USER_STATE_NULL_CHANNEL/,
    );
  });
});
