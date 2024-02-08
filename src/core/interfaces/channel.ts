import { User } from "./user";

export interface Channel {
  getId(): string;
  getUsers(): User[];
  clone(): Promise<Channel>;
}
