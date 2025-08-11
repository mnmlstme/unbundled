import { Tour, Traveler } from "server/models";

export interface TourItem {
  id: string;
  name: string;
}

export interface Model {
  profile?: Traveler;
  tour?: Tour;
  tourIndex?: TourItem[];
}

export const init: Model = {};
