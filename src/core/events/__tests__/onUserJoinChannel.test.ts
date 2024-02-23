import { onUserJoinChannel } from "@core/events";
import { Channel } from "@core/ports";
import { ChannelRepository } from "@core/repositories";
import { describe, expect, it, vi } from "vitest";

describe("On user join a channel", () => {
  it("Should clone the channel from where the user come", async () => {
    const cloneMock = vi.fn();

    const channelRepository: ChannelRepository = {
      getById: () =>
        Promise.resolve({
          clone: cloneMock,
          getId: () => "channel-id-1",
          getUsers: () => [],
        }),
    };

    await onUserJoinChannel(channelRepository)(
      {
        getChannelId: () => null,
      },
      {
        getChannelId: () => "channel-id-1",
      },
    );

    expect(cloneMock).toHaveBeenCalledOnce();
  });

  it("Should move every members from the previous channel to the cloned one", async () => {
    const setChannelMock = vi.fn();

    const channelClonedStub: Channel = {
      clone: () => Promise.reject(),
      getId: () => "",
      getUsers: () => [],
    };

    const channelRepository: ChannelRepository = {
      getById: () =>
        Promise.resolve({
          clone: () => Promise.resolve(channelClonedStub),
          getId: () => "channel-id-1",
          getUsers: () => [
            {
              setChannel: setChannelMock,
            },
          ],
        }),
    };

    await onUserJoinChannel(channelRepository)(
      { getChannelId: () => null },
      {
        getChannelId: () => "channel-id-1",
      },
    );

    expect(setChannelMock).toHaveBeenCalledWith(channelClonedStub);
  });

  it("Should raise an error if the user leave a channel without joining a new one", async () => {
    const channelRepository: ChannelRepository = {
      getById: () => Promise.reject(),
    };

    const onUserLeave = () =>
      onUserJoinChannel(channelRepository)(
        {
          getChannelId: () => null,
        },
        {
          getChannelId: () => null,
        },
      );

    await expect(onUserLeave).rejects.toThrowError(
      "No channel associated to the user state",
    );
  });
});
