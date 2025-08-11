import { Traveler } from "server/models";

export type Message =
  // [ command, args ]
  | ["profile/request", { userid: string }]
  | ["profile/save", { userid: string, profile: Traveler }]
  // much more to come...
  ;
