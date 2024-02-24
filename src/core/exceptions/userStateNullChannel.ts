export class UserStateNullChannel extends Error {
  constructor() {
    super(`No channel associated to the user state`);
  }
}
