import Thing from "./thing.js";

export class Shape extends Thing {
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

class Square extends Rect {
  constructor(name, s) {
    super(name, s, s);
  }
}

export { Rectangle, Square };
