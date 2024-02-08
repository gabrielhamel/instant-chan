import { Channel } from "../interfaces/channel";
import { User } from "../interfaces/user";
import { VoiceState } from "../interfaces/voiceState";

const relocateVoiceChannelMembers = async (
  source: Channel,
  destination: Channel,
) => {
  const membersToMove = source.getUsers();

  const relocateMemberToNewVoiceChannel = (member: User) =>
    member.setVoiceChannel(destination);

  const relocateMembersToNewChannel = membersToMove.map(
    relocateMemberToNewVoiceChannel,
  );

  await Promise.all(relocateMembersToNewChannel);
};

const cloneChannelAndRelocateUsers = async (source: Channel) => {
  const newChannel = await source.clone();
  await relocateVoiceChannelMembers(source, newChannel);
};

export const handleVoiceStateUpdate = async (
  oldState: VoiceState,
  newState: VoiceState,
) => {
  const joinedChannel = newState.getChannel();
  await cloneChannelAndRelocateUsers(joinedChannel);
};
