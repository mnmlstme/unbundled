// module Kram_986b7f8f_classes (ES6)
          
          console.log('Loading module "Kram_986b7f8f_classes"')
          export function Program ({connectStore, initializeStore}) {
            // JS Definition from scene 1
class Thing {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `I am ${this.name}`;
  }
}

class Shape extends Thing {
  constructor(name) {
    super(name);
  }

  get area() {
    return 0;
  }

  greet() {
    return `${super.greet()} and my area is ${this.area}`;
  }
}

// JS Definition from scene 1
const th = new Thing("some thing");
const sh = new Shape("some shape");

console.log(th.greet());
console.log(sh.greet());

// JS Definition from scene 2
class Rectangle extends Shape {
  constructor(name, w, h) {
    super(name);
    this._dims = { width: w, height: h };
  }

  get area() {
    const { width, height } = this._dims;
    return width * height;
  }
}

class Square extends Rectangle {
  constructor(name, s) {
    super(name, s, s);
  }
}

// JS Definition from scene 2
const rect = new Rectangle("some rectangle", 3, 4);
const sq = new Square("some square", 5);

console.log(rect.greet());
console.log(sq.greet());

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