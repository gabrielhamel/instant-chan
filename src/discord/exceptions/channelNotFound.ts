export class DiscordChannelNotFound extends Error {
  constructor(channelId: string) {
    super(`Channel ${channelId} not found`);
  }
}
