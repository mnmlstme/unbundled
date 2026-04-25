export type EventListener = (ev: Event) => void;
export type EventMap = { [key: string]: EventListener };





export const Events = {
  listen,
  delegate
};
