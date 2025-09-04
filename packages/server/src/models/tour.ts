import { Destination } from "./destination";
import { Transportation } from "./transportation";
import { Traveler } from "./traveler";

export interface Tour {
  id: string;
  name: string;
  destinations: Array<Destination>;
  transportation: Array<Transportation>;
  startDate: Date;
  endDate: Date;
  entourage: Array<Traveler>;
}

export type TourBrief =
  Pick<Tour, "id" | "name" | "startDate" | "endDate"> &
  { entourage: Array<string> }
