// module Kram_a9f90145_partials (ES6)
          
          console.log('Loading module "Kram_a9f90145_partials"');
          function Program ({connectStore, initializeStore}) {
            // JS Definition from scene 1
function addText(text, container) {
  const node = new Text(text);
  container.append(node);
}

window.addText = addText;

// JS Definition from scene 2
function addParagraph(text, container) {
  const p = document.createElement("p");
  p.textContent = text;
  container.append(p);
}

window.addParagraph = addParagraph;

// JS Definition from scene 3
const parser = new DOMParser();

function addFragment(htmlString, container) {
  const doc = parser.parseFromString(htmlString, "text/html");

  const fragment = Array.from(doc.body.childNodes);

  container.append(...fragment);
}

window.addFragment = addFragment;

// JS Definition from scene 4
function addTextFrom(url, container) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => addText(text, container));
}

window.addTextFrom = addTextFrom;

// JS Definition from scene 5
function addFragmentFrom(url, container) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => addFragment(text, container));
}

window.addFragmentFrom = addFragmentFrom;

            return ({
              
            })
          }
          function mount (mountpoint, initial) {
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
            const program = Program({connectStore});
            return (n, container) => {
              program[n-1].call(container);
            }
          }

export { Program, mount };
