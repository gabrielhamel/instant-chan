import { UserStateNullChannel } from "@core/exceptions";
import { Channel, User, UserState } from "@core/ports";
import { ChannelRepository } from "@core/repositories";

const relocateChannelMembers = async (
  source: Channel,
  destination: Channel,
) => {
  const membersToMove = source.getUsers();

  const relocateMemberToNewChannel = (member: User) =>
    member.setChannel(destination);

  const relocateMembersToNewChannel = membersToMove.map(
    relocateMemberToNewChannel,
  );

  await Promise.all(relocateMembersToNewChannel);
};

export const onUserJoinChannel =
  (channelRepository: ChannelRepository) =>
  async (_oldState: UserState, newState: UserState) => {
    const joinedChannelId = newState.getChannelId();

    if (!joinedChannelId) {
      throw new UserStateNullChannel();
    }

    const joinedChannel = await channelRepository.getById(joinedChannelId);

    const clonedChannel = await joinedChannel.clone();
    await relocateChannelMembers(joinedChannel, clonedChannel);
  };
