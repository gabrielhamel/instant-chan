import { User } from "./user";

export interface Channel {
  getUsers(): User[];
  clone(): Promise<Channel>;
}
