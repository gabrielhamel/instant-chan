export interface ChannelBoundedRepository {
  isBounded(channelId: string): Promise<boolean>;
}
