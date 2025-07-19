export type EventListener = (ev: Event) => void;
export type EventMap = { [key: string]: EventListener };

/**
 * Memory leak warning!
 * Need to also clean up all the event listeners, probably
 * on disconnectCallback();
 */

function listen(element: Element | DocumentFragment, map: EventMap) {
  for (const eventType in map) {
    element.addEventListener(eventType, map[eventType]);
  }
}

function delegate(
  element: Element | DocumentFragment,
  selector: string,
  map: EventMap
) {
  for (const eventType in map) {
    const listener = function (ev: Event) {
      const target = ev.target as HTMLElement;
      if (target && target instanceof HTMLElement && target.matches(selector)) {
        map[eventType](ev);
      }
    };
    element.addEventListener(eventType, listener);
  }
}

export const Events = {
  listen,
  delegate
};
