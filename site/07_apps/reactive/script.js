// module Kram_ae3b1e21_reactive.kr (ES6)
          import { register } from "/_scripts/oper.ative.js"
          
          console.log('Loading module "Kram_ae3b1e21_reactive.kr"')
          export function Program ({connectStore}) {
            // JS Definition from scene 1
class WithStoreElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("with-store-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const { get } = connectStore();
    this.getFromStore = get;
    this.dataset.store = JSON.stringify(".");
  }
}

class OOElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("o-o-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    this._updateRendering();
  }

  _updateRendering() {
    const valueSpan = this.shadowRoot.getElementById("value");

    const store = this.closest("[data-store]");

    // get field key from slot#key
    const key = this.textContent;

    // lookup key in store
    const value = store.getFromStore(key);

    console.log("Rendering o-o data: ", key, value);

    // set className and innerText on span#value
    switch (typeof value) {
      case "undefined":
        valueSpan.className = "no-value";
        valueSpan.innerText = "";
        break;
      default:
        valueSpan.className = "string-value";
        valueSpan.innerText = value.toString();
    }
  }
}

customElements.define("with-store", WithStoreElement);
customElements.define("o-o", OOElement);

            return ({
              
            })
          }
          export function mount (mountpoint, initial) {
            let Store = {
              root: Object.assign({}, initial),
            };
            const connectStore = (root = "root") => ({
                get: (key) => Store[root][key],
            })
            const program = Program({connectStore})
            return (n, container) => {
              program[n-1].call(container)
            }
          }
          register("Kram_ae3b1e21_reactive.kr", {Program, mount})
        

  const STORE_CHANGE_EVENT = 'store:change';
    
  function createStore(eventTarget, initial = {}) {
    let root = Object.assign({}, initial)
    
    console.log("create Store", JSON.stringify(root));

    return new Proxy(root, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);
        console.log(`Store['${prop}'] => ${JSON.stringify(value)}`)
        return value;
      },
      set: (target, prop, newValue, receiver) => {
        const oldValue = root[prop];
        console.log(`Store['${prop}'] <= ${JSON.stringify(newValue)}; was ${JSON.stringify(oldValue)}`)
        const didSet = Reflect.set(target, prop, newValue, receiver);
        if ( didSet ) {
          eventTarget.dispatchEvent(changeEvent(prop, newValue, oldValue));
        }
        return didSet;
      }
    });
  }
    
  function changeEvent(prop, newValue, oldValue) {
    // ref: https://infrequently.org/2021/03/reactive-data-modern-js/
    let evt = new CustomEvent(STORE_CHANGE_EVENT, { bubbles: true, cancelable: true})
    evt.oldValue = oldValue;
    evt.value = newValue;
    evt.property = prop;
    
    return evt;    
  }

  customElements.define("st-ative", class extends HTMLElement {
    connectedCallback() {
      let Store = createStore(this, {
        "current-scene": 1
      });
      
      this.dataset.provider = JSON.stringify(".");
      
      this.observe = (key, watcher) => {
        if ( watcher ) {
          this.addEventListener(STORE_CHANGE_EVENT, (evt) => {
            if (evt.property === key) {
              watcher(evt.value, evt.oldValue)
            }
          })
        }
        return { value: Store[key] };
      }
      
      this.bind = (key, watcher) => {
        const observation = this.observe(key, watcher)
        return {
          get: () => Store[key],
          set: (newValue) => Store[key] = newValue,
          ...observation
        }
      }
      
      console.log("Store provider connected");
    }
  })
    


customElements.define("consolid-ative", class extends HTMLElement {
  connectedCallback() {
    let provider = this.closest("[data-provider]");
    
    const {value: currentScene} = provider.observe('current-scene',
       (newValue) => {
         console.log("Setting layout to scene", newValue)
         this.style = `--current-scene: ${newValue}`
       }
    );
    
    console.log("Consolid-ative (webc)");
  }
});


	console.log("Narr-ative component (webc)");


  customElements.define("navig-ative", class extends HTMLElement {
    connectedCallback() {
      let provider = this.closest("[data-provider]");
      let numberInput = this.querySelector(':scope input[type="number"]');
      let previousButton = this.querySelector(':scope button[name="previous"]');
      let nextButton = this.querySelector(':scope button[name="next"]');
      
      const {get, set} = provider.bind('current-scene', 
        (newValue) => numberInput.value = newValue
      );
      
      numberInput.value = get();
      
      numberInput.addEventListener("change", () =>
        set(numberInput.value)
      )
      
      previousButton.addEventListener("click", () => 
        set( get() - 1 )
      )

      nextButton.addEventListener("click", () => {
        set( get() + 1 )
      })
    }
  })
