import { Channel } from "./channel";

export interface UserState {
  getId(): string;
  getChannel(): Channel | null;
}
