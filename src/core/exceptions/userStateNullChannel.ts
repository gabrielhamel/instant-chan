export class UserStateNullChannel extends Error {
  constructor(userStateId: string) {
    super(`No channel associated to the user state ${userStateId}`);
  }
}
