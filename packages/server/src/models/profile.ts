export interface Profile {
  userid: string;
  name: string;
  nickname?: string;
  home: string;
  airports: Array<string>;
  avatar?: undefined;
  color?: string;
}
