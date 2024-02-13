import { UserStateNullChannel } from "../exceptions/userStateNullChannel";
import { Channel } from "../ports/channel";
import { User } from "../ports/user";
import { UserState } from "../ports/userState";
import { ChannelRepository } from "../repositories/channel";

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

const cloneChannelAndRelocateUsers = async (source: Channel) => {
  const newChannel = await source.clone();
  await relocateChannelMembers(source, newChannel);
};

export const onUserJoinChannel =
  (channelRepository: ChannelRepository) =>
  async (oldState: UserState, newState: UserState) => {
    const joinedChannelId = newState.getChannelId();

    if (!joinedChannelId) {
      throw new UserStateNullChannel();
    }

    const joinedChannel = await channelRepository.getById(joinedChannelId);

    await cloneChannelAndRelocateUsers(joinedChannel);
  };
