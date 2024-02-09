import { UserStateNullChannel } from "../exceptions/userStateNullChannel";
import { Channel } from "../interfaces/channel";
import { User } from "../interfaces/user";
import { UserState } from "../interfaces/userState";

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

export const onUserJoinChannel = async (
  oldState: UserState,
  newState: UserState,
) => {
  const joinedChannel = newState.getChannel();

  if (!joinedChannel) {
    throw new UserStateNullChannel(newState.getId());
  }

  await cloneChannelAndRelocateUsers(joinedChannel);
};
