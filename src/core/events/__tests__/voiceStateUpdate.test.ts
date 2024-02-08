import { describe, expect, it, vi } from "vitest";
import { Channel } from "../../interfaces/channel";
import { User } from "../../interfaces/user";
import { VoiceState } from "../../interfaces/voiceState";
import { handleVoiceStateUpdate } from "../voiceStateUpdate";

describe("Voice state update event", () => {
  it("Should clone the channel from where the user come", async () => {
    const channelCloneMock = vi.fn();
    const oldState: VoiceState = { getChannel: vi.fn() };
    const newState: VoiceState = {
      getChannel: vi.fn<unknown[], Channel>().mockReturnValue({
        clone: channelCloneMock,
        getUsers: vi.fn<unknown[], User[]>().mockReturnValue([]),
      }),
    };

    await handleVoiceStateUpdate(oldState, newState);

    expect(channelCloneMock).toHaveBeenCalledOnce();
  });

  it("Should move every members from the previous channel to the cloned one", async () => {
    const clonedChannel: Channel = {
      clone: vi.fn(),
      getUsers: vi.fn(),
    };

    const userToMove: User = {
      setVoiceChannel: vi.fn(),
    };

    const oldState: VoiceState = { getChannel: vi.fn() };
    const newState: VoiceState = {
      getChannel: vi.fn<unknown[], Channel>().mockReturnValue({
        clone: vi
          .fn<unknown[], Promise<Channel>>()
          .mockReturnValue(Promise.resolve(clonedChannel)),
        getUsers: vi.fn<unknown[], User[]>().mockReturnValue([userToMove]),
      }),
    };

    await handleVoiceStateUpdate(oldState, newState);

    expect(userToMove.setVoiceChannel).toHaveBeenCalledWith(clonedChannel);
  });
});
