import { Context } from "../effects";
import { dispatcher, ApplyMap, Provider, Service } from "../service";

const HISTORY_CONTEXT_DEFAULT = "context:history";

interface HistoryModel {
  location: Location;
  state: object;
}

type HistoryMsg =
  | [
    "history/navigate",
    {
      href: string;
      state?: object;
    }
  ]
  | [
    "history/redirect",
    {
      href: string;
      state?: object;
    }
  ];

class HistoryService extends Service<HistoryMsg, HistoryModel> {
  static EVENT_TYPE = "history:message";

  constructor(context: Context<HistoryModel>) {
    super(
      (msg, apply) => this.update(msg, apply),
      context,
      HistoryService.EVENT_TYPE
    );
  }

  update(message: HistoryMsg, apply: ApplyMap<HistoryModel>) {
    switch (message[0]) {
      case "history/navigate": {
        const { href, state } = message[1];
        apply(navigate(href, state));
        break;
      }
      case "history/redirect": {
        const { href, state } = message[1];
        apply(redirect(href, state));
        break;
      }
    }
  }
}

export class HistoryProvider extends Provider<HistoryModel> {
  get base() {
    return this.getAttribute("base") || undefined;
  }

  constructor() {
    super(
      {
        location: document.location,
        state: {}
      },
      HISTORY_CONTEXT_DEFAULT
    );

    this.addEventListener("click", (event: MouseEvent) => {
      const linkTarget = originalLinkTarget(event);
      if (linkTarget) {
        // It's a left click on an <a href=...>.
        const url = new URL(linkTarget.href);

        const location = this.context.get(
          "location"
        ) as Location;
        if (location && url.origin === location.origin
          && url.pathname.startsWith(this.base || "/")
        ) {
          console.log("Preventing Click Event on <A>", event);
          event.preventDefault();
          dispatch(linkTarget, "history/navigate", {
            href: url.pathname + url.search
          });
        }
      }
    });

    window.addEventListener("popstate", (event) => {
      console.log("Popstate", event.state);
      this.context.update({
        location: document.location,
        state: event.state
      });
    });
  }

  connectedCallback() {
    const service = new HistoryService(this.context);
    service.attach(this);
  }

  attributeChangedCallback() {

  }
}

function originalLinkTarget(
  event: MouseEvent
): HTMLAnchorElement | undefined {
  const current = event.currentTarget;
  const isLink = (el: EventTarget) =>
    (el as HTMLElement).tagName == "A" &&
    (el as HTMLAnchorElement).href;

  if (event.button !== 0) return undefined;

  if (event.composed) {
    const path = event.composedPath();
    const target = path.find(isLink);
    return target ? (target as HTMLAnchorElement) : undefined;
  } else {
    for (
      let target: HTMLElement | null =
        event.target as HTMLElement;
      target;
      target === current
        ? null
        : (target as HTMLElement).parentElement
    ) {
      if (isLink(target)) return target as HTMLAnchorElement;
    }
    return undefined;
  }
}

function navigate(href: string, state: object = {}) {
  history.pushState(state, "", href);
  return () => ({
    location: document.location,
    state: history.state
  });
}

function redirect(href: string, state: object = {}) {
  history.replaceState(state, "", href);
  return () => ({
    location: document.location,
    state: history.state
  });
}

const dispatch = dispatcher<HistoryMsg>(HistoryService.EVENT_TYPE);


export {
  HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
  HistoryProvider as Provider,
  HistoryService as Service,
  type HistoryModel as Model,
  type HistoryMsg as Message,
  dispatch
};
