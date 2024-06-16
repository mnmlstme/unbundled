// module Kram_ff9911dd_events (ES6)
          
          console.log('Loading module "Kram_ff9911dd_events"')
          export function Program ({connectStore, initializeStore}) {
            // JS Definition from scene 2
const links = document.querySelectorAll(".itinerary > dd > a[href]");

for (const link of links) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    loadHTML(event.target.href, event.target.closest("dd"));
  });
}

// JS Definition from scene 3
const itinerary = document.querySelector(".itinerary");

itinerary.addEventListener("click", (event) => {
  event.preventDefault();
  loadHTML(event.target.href, event.target.closest("dd"));
});

// JS Definition from scene 4
const page = document.body;

page.addEventListener("change", (event) => {
  const checked = event.target.checked;
  page.classList.toggle("dark-mode", checked);
});

// JS Definition from scene 6
document.body.addEventListener("dark-mode", (event) => {
  const page = event.currentTarget;
  const checked = event.detail.checked;
  page.classList.toggle("dark-mode", checked);
});

// JS Definition from scene 7
function toggleDarkMode(target, checked) {
  const customEvent = new CustomEvent("dark-mode:toggle", {
    bubbles: true,
    detail: { checked },
  });

  target.dispatchEvent(customEvent);
}

// JS Definition from scene 8
function relayEvent(event, customType, detail) {
  const relay = event.currentTarget;
  const customEvent = new CustomEvent(customType, {
    bubbles: true,
    detail,
  });

  relay.dispatchEvent(customEvent);
  event.stopPropagation();
}

            return ({
              
            })
          }
          export function mount (mountpoint, initial) {
            let Store = {
              root: Object.assign({}, initial),
            };
            const connectStore = (path = ["root"]) => {
              let root = Store;
              path.forEach((key) => root = root[key]);
              return ({
                root,
                get: (key) => root[key],
                set: (key, value) => root[key] = value,
                keys: () => Object.keys(root),
              })};
            const program = Program({connectStore})
            return (n, container) => {
              program[n-1].call(container)
            }
          }