---
title: Javascript Classes
platform: web-standard
---

```js
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
```

```js
const th = new Thing("some thing");
const sh = new Shape("some shape");

console.log(th.greet());
console.log(sh.greet());
```

```html
<pre>
I am some thing
<hr>I am some shape and my area is 0
</pre>
```

---

```js
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
```

```js
const rect = new Rectangle("some rectangle", 3, 4);
const sq = new Square("some square", 5);

console.log(rect.greet());
console.log(sq.greet());
```

```html
<pre>
I am some rectangle and my area is 12
<hr>I am some square and my area is 25
</pre>
```
