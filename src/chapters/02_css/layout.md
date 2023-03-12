---
title: CSS Layout
platform: web-standard
---

# CSS Layout

Layout is the process of determining where to position each piece of
content in 2-dimensional space. You may be familiar with this concept
from desktop publishing tools such as Adobe InDesign, or its predecessor
Pagemaker. Or even from the pre-digital printing practice utilizing
columns of text, called galleys, which are then cut to length and pasted
up on a grid along with photos and illustrations.

CSS layout borrows from this long history of page layout in graphic
design. However, layouts for the web need to be more flexible than those
for physical media. In a typical desktop publishing process, the
designer has the content available, and also knows the size of the pages
that are being printed. If one of these changes, the designer will go
through the layouts and update so that the content fits on the pages.

When designing layouts for the web, however, the designer often doesn't
have the content, because it hasn't been generated yet. The output
medium is also variable, as the resulting layout will be viewed on many
different devices, at different sizes and resolutions. Users may also
have configured their devices to their own preferences, such as font
size or scale factor.

If web pages were rendered at a fixed size like pages of a physical
book, they could still be legible, but much more difficult to consume.
This is the situation we encounter when documents are preformatted as
PDF. The pages of a PDF file are usually intended for printing on one of
the standard paper sizes. It can be previewed on a screen, and if that
screen is large enough and has adequate resolution, this screen view may
be an acceptable reading experience. But view that same file on a mobile
phone, tablet, or even most laptop computers, and users will have to
zoom out to see the entire page, and zoom in to make the text legible.
When zoomed in, they will have to scroll or drag the page up/down and
left/right to access all of the content. This is not an acceptable
reading experience. And if the content is something that the user needs
to interact with, it quickly becomes unworkable.

Since pre-formatted pages are unacceptable, web layout must be deferred
until both the full content, and the target screen characteristics are
known. This means the actual formatting has to take place in the
browser. It also means that any layout instructions we give to the
browser cannot be overly specific. In essence, CSS layout is about
providing constraints, hints, and strategies, which the browser then
applies as needed to present the content on each specific device
configuration.

There is a very general strategy, built into every browser, which is
applied when no CSS layout has been given. It starts by assuming that
the content has been properly marked up in HTML. The markup is used to
divide the content into `block` elements and `inline` elements. Block
elements are larger pieces of content like paragraphs, headings,
figures, tables, and lists. Inline elements are shorter strings of
characters such as links, quotations, emphasized phrases, and
(strangely) images. Block elements may contain inline elements, other
block elements, or both. Inline elements may only contain other inline
elements.

Once the content is divided into block and inline elements, the layout
strategy proceeds as follows:

- Block elements are stacked vertically. Each block element extends the
  full width of the page or enclosing block element.
- Inline elements flow in a horizontal line, and may wrap to multiple
  lines if they exceed the width of the enclosing block element.

---

## Controlling the size of blocks

```html
<p class="boxed-text">Paragraphs are by default full width.</p>
<p class="narrow-box boxed-text">This box is narrow.</p>
<p class="narrow-box boxed-text">
  If we add more content to a narrow box, that content will wrap to as many
  lines as it needs, making the box taller.
</p>
<p class="narrow-box two-line-box boxed-text">
  If we constrain the height of the box, the content will overflow.
</p>
```

Let's draw make the box around our blocks visible. We can define the
class `boxed-text` to do that:

```css
.boxed-text {
  border: 1px solid lightCoral;
}
```

Our box extends to the full width of the page, because that is the
default layout for block elements. To change the width of the box, we
can use the `width` property:

```css
.narrow-box {
  width: 15em;
}
```

We can also control the height of the box, using the `height` property:

```css
.two-line-box {
  height: 2.5em;
}
```

---

## Intrinsic Sizing

```html
<p class="boxed-text narrow-box">Too little text.</p>
<p class="boxed-text hug-box">This box hugs content.</p>
<p class="boxed-text squeeze-box">This box is as narrow as it can be.</p>
<p class="boxed-text min-box">
  This box is not too narrow because it has a minimum width.
</p>
<p class="boxed-text min-box">
  This box has a minimum width, but if there are
  <em class="non-breaking">phrases that cannot be broken</em>
  , CSS will make room for them.
</p>
```

In the previous section, we looked at the box model, and how setting the
`width` on a box forces the text within the box to wrap. But there are
also times when we want the box to _hug_ the contents.

```css
.hug-box {
  width: max-content;
}

.squeeze-box {
  width: min-content;
}
```

```css
.min-box {
  min-width: 8em;
  width: min-content;
}

.non-breaking {
  white-space: nowrap;
}
```

---

## Margins and Padding

```html
<section class="boxed-section">
  <h1 class="boxed-text">
    <em>Metamorphosis</em>
    by Franz Kafka
  </h1>

  <p class="boxed-text with-margins">
    One morning, when Gregor Samsa woke from troubled dreams, he found himself
    transformed in his bed into a horrible vermin. He lay on his armour-like
    back, and if he lifted his head a little he could see his brown belly,
    slightly domed and divided by arches into stiff sections. The bedding was
    hardly able to cover it and seemed ready to slide off any moment. His many
    legs, pitifully thin compared with the size of the rest of him, waved about
    helplessly as he looked.
  </p>
  <p class="boxed-text with-padding">
    “What’s happened to me?” he thought. It wasn’t a dream. His room, a proper
    human room although a little too small, lay peacefully between its four
    familiar walls. A collection of textile samples lay spread out on the
    table—Samsa was a travelling salesman—and above it there hung a picture that
    he had recently cut out of an illustrated magazine and housed in a nice,
    gilded frame. It showed a lady fitted out with a fur hat and fur boa who sat
    upright, raising a heavy fur muff that covered the whole of her lower arm
    towards the viewer.
  </p>
</section>
```

```css
.boxed-section {
  width: 25em;
  border: 1px solid plum;
}

.with-margins {
  margin: 2em;
}

.with-padding {
  padding: 2em;
}
```

---

## Box Model

```html
<section>
  <p class="content-box">Here is our content.</p>
  <img src="../_files/Box Model.svg" />
</section>
```

In the previous section, we used `padding` to make space inside an element's border,
and `margin` to make space outside.
We are now ready to look at the CSS _box model_, and how the overall
`width` and `height` of an element are computed.

```css
.content-box {
  box-sizing: content-box; /* (default) */
  width: 200px;
  height: 50px;
  padding: 2rem;
  background: lightCoral;
  border: 0.5rem dashed plum;
  margin: 2rem;
}
```

For any element presented, the CSS box model defines 4 different boxes.
The innermost box is the _content box_.
This is where any content inside the element is placed.
In this example, we have a `<p>` element which contains some text.

The next box is the _padding box_, which contains the content box
as well as any `padding` from the CSS applied to the element.
In this example, we have `2.0rem` of padding on all sides.

Next is the _border box_, which contains the padding box
as well as any `border` from the CSS applied to the element.
In this example, we have a transparent border which is `0.5rem` wide
on all sides.
Note that even though the border is transparent, it still contributes
to the overall height and width calculations for the box.

When we are laying out content on a web page, and arranging boxes next to each
other, it is usually the border box that we're concerned with.
This is because the border box is the maximum visual extent of the element.
All of an element's content, as well as its border is contained in the border box.

Though the border box is the visual extent of the element, for historical
reasons, CSS uses the `width` and `height` properties to determine the
size of the content box.
We will see in the next section how we can instead specify the dimensions of the
border box, and have CSS compute the limits of the content box.

If a `background` has been applied to the element, it will also be contained by the border box.
If the element has a background and a border, the background will extend all the way to the
outside edge of the border box.
This can be observed by applying a transparent border, as in our example.

The final box in the box model lies outside the element, and serves to
separate it from adjacent or enclosing boxes.
This is the _margin box_ which contains the border box as well as any `margin`
applied around the element.

---

## The `box-sizing` property

```html
<p class="content-box">
  This content box has a width of 200px. We've put a box with a border around
  it.
</p>

<p class="border-box">
  This border box has a width 200px. We've put the content inside.
</p>
```

```css
.border-box {
  box-sizing: border-box;
  width: 200px;
  height: auto;
  padding: 2rem;
  background: azure;
  border: 0.5rem dashed plum;
  margin: 2rem 4.5rem;
}
```

We've seen that by default, the `width` property refers to the width of the element's
_content box_, exclusive of the padding and border. Sometimes this is what
you want, but at other times, we want to make this box fit into a larger
layout, and it would be easier for us to specify the overall width of
the box, including padding and borders. In fact, before CSS was
standardized, that is exactly how some browsers (notably Internet
Explorer) interpreted `width`. This was called _Quirks mode_.

When CSS standardized the definition of the `width` property, it
would've been very difficult to convert the large amounts of CSS that
were written assuming _Quirks mode_'s box model. So another property,
`box-sizing` was added to provide support for three box models:
`content-box` (the default), `border-box` (the Quirks mode one), and
`padding-box` (which considers everything up to the inside edge the border
to contribute to the width).

Even though the default is `content-box`, many developers still prefer
`border-box`, and end up "resetting" the default `box-sizing` to
`border-box`. In the following discussion, we will assume this reset has
been applied to the CSS.

```css
* {
  /* reset the box model to use border-box */
  box-sizing: border-box;
}
```

In the instances where we actually intend to size the content box (or the padding box for
that matter), we will explicitly set the `box-sizing` property.

---

## Flex Layouts

---

## Grid Layouts

---

## Dealing with Overflow

When designing layouts, we should always consider the content that is
being presented. In rare cases, the content is static. We know what it
is and it will never change. But frequently the same layout is used to
contain different content at different times. For example, the same
layout may be used to present all the articles on a news site.

Designers often work with placeholder text when working with content
that is unknown or subject to change. But we also need to anticipate
what will happen when some unusual text occurs.

We've seen that within block elements,
content is laid out as lines of text
which may wrap to the next line.
The default CSS of `width: auto;`, which allows lines to be
as wide as possible,
this strategy is usually sufficient to avoid horizontal overflow.

To avoid vertical overflow, the CSS default is again the simplest approach.
With CSS of `height: auto;`, boxes will grow in height to accommodate
all of the content.
Of course, this may force each enclosing box to get taller,
ultimately increasing the size of the page as it is presented on the screen.

For this reason, traditional web layouts have a fixed width,
but scroll vertically.
For web pages that are primarily focused on presenting content,
avoiding overflow in this way is often the best layout strategy.
Our first strategy for managing overflow is to avoid overflow.

---

## Scrolling

---

## Locating Content Out-of-Flow

---

## Absolute Positioning
