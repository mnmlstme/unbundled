---
title: Mapping CSS to HTML with Rules
---

```html
<h1 style="font: italic bold 2rem Georgia; color: darkOrange;">
  Hello, in style!
</h1>

<h1>Chapter 1. Keep it Simple</h1>

<h1 id="Chapter02">Chapter 2. Make it Fancy</h1>

<h1 class="fancy">Also fancy, but normal size.</h1>

<p class="fancy schmancy">Now we're getting really fancy</p>
```

## Mapping CSS to HTML with Rules

Though we want to keep presentation separate from content,
we also need to relate them to each other.
For each presentation style that we define in CSS,
there are several ways to select the HTML element or elements
to which the style applies.
This combination of a style and a content selector is called a
_rule_.

Before exploring rules in earnest,
consider the most direct way of applying a style to
an HTML element: the `style` attribute.
Any element can be styled inline by providing a list
of CSS property/value pairs in the `style`.

In general, we don't want to mix content and presentation like
this.
If we do, then modifying the presentation will be very tedious
and error-prone.
Also, whenever we add new content, we'd have to be careful to match
the existing style.

Luckily, there is a better way to identify a set of elements
in an HTML document: _selectors_.
You can think of a selector as a pattern that identifies
a set of matching elements.
Once we have selected a set of elements, we can then apply
the same style to all those elements with a rule.

In the previous chapter, we learned how writing semantic HTML
makes it easier for both humans and computers to process the
content and operate on it.
It should not be surprising then, that there are CSS selectors
which apply presentation styles on the basis of semantic tags
in our HTML.

We will now write our first CSS rule.
To write a CSS rule with a _tag selector_, we write the name
of the element tag we wish to match, for example `h1`.
The style part of the rule is surrounded by curly braces,
and is a list of all the style properties we wish to apply
to the matched elements.

```css
h1 {
  font: 2rem;
}
```

Tag selectors allow us to apply very general styling rules
to an entire document.
They require no changes to the HTML and also apply
uniformly to all newly authored content,
as long as it follows the same semantic HTML conventions.
Because they apply to an entire document (or even an entire site),
tag selectors allow us to establish a baseline style
which we can specialize as need be.

On the other end of the specificity spectrum is the `id` selector,
which allows us to identify one single element for our rule.
We need to modify the HTML in this case, and add an `id` attribute
to the one element.
In the CSS rule, we then refer to that element by placing a
hash `#` character in front of it.

```css
#Chapter02 {
  font: italic 3rem Georgia;
}
```

The HTML standard prohibits more than one element in a document
with the same `id`, so an `id` rule is guaranteed to only match
one element.
In this respect, it is similar to using the style attribute,
but it allows us to keep all the styles together in the CSS
file for easier maintenance.

In between the very general tag selector
and the very specific `id` selector is the `class` selector.
Like `id`, the `class` attribute may be applied to any element
in HTML.

However, the same class name may be applied to many elements,
and an element's `class` attribute may include multiple class
names (separated by spaces).

We specify a CSS class rule by placing a dot (`.`) before
the name of the class.

```css
.fancy {
  font-style: italic;
  font-family: Georgia;
  color: darkOrange;
}

.schmancy {
  font-family: Brush Script MT, cursive;
  color: fireBrick;
}
```

Note that the same element may match multiple `class` rules.
In addition, we've seen that the same element may match
a tag rule, an `id` rule, and a `class` rule.
This is part of the power of CSS.
As a pattern-matching language, it allows us to compose
new styles by layering rules on top of each other.
While this power makes it relatively easy to make
sweeping changes in our presentation style,
it can also lead to unintentional results when styles
conflict.

In the next section we will learn how CSS handles conflicts
between multiple matching rules,
and explore some best practices for managing our CSS rules
to avoid the problems arise from those conflicts.

---

```html
<h1>Chapter 1. Keep it Simple</h1>

<h1 id="Chapter02">Chapter 2. Make it Fancy</h1>

<h1 class="fancy">Also fancy, but normal size.</h1>

<p class="fancy schmancy">Now we're getting really fancy</p>
```

## Specificity and the Cascade

In the previous section, we wrote some CSS rules and some HTML that matched
the selectors for those rules.
Several of the elements, in fact, matched multiple selectors,
and in some cases, the rules applied assigned different values to the same
property (e.g., `font` or `color`).
That is, there were conflicts between the rules applied to some elements.
Although the results were what we intended, a slight change to how we wrote
our CSS would have changed the way the conflicts were resolved, and yielded
unexpected results (also known as a bug).

We need to go back and understand why our CSS worked,
so that we can avoid these kinds of bugs.
We will also learn ways to make our code be more resilient and better
reflect our design intent.
To gain this understanding, we need to learn about _specificity_ and
the _cascade_.

Cascade is what the "C" in "CSS" stands for.
So clearly, it's pretty fundamental to how CSS works.
And yet, even senior developers continue to be frustrated by the cascade,
spending too much of their time to try to defeat it.
Instead, we're going to take the time to learn why the cascade was
invented in the first place, and why it still makes sense over 25 years later.
We'll learn how to work _with_ specificity to better express the design
intent and prioritize between conflicting demands.

The cascade was a a key part of the CSS language as proposed in October 1994 by
Håkon Wium Lie.
The newly-formed W3C was very interested in standardizing style sheets for the
web, and convened a committee to develop the CSS standard.
The CSS Level 1 Specification was released by the W3C in December 1996,
and soon after adopted (incompletely and incompatibly) by the warring
browsers, Microsoft Internet Explorer and Netscape Navigator.

Prior to CSS, the presentation of web pages was set by browser vendors,
so web pages looked different between browsers.
The original browser written by Tim Berners-Lee made use
of an internal stylesheet, but did not give users the ability to customize it.
Some browsers gave users access to this stylesheet, allowing users to override
the browser's styles, in much the same way that Microsoft Word allows the
default paragraph, heading, and list styles to be redefined.
These early examples of stylesheets were by necessity very general,
as they would be applied to every web page the user visited.

Meanwhile, web designers and publishers, expected to be able to
control how their content was presented on the web.
After all, this is what they were used to in print media,
and PDF afforded them this capability.
Brands especially didn't want
browser vendors or users changing the styling
of their pages, and would resort to converting type to images
for publishing to the web.

In response to the demand for publisher control of page styling,
Netscape added the HTML `<font>` tag in 1995.
While it gave publishers control over the color, face, and size of type
this element had to be inserted into the HTML at every place where
the designer wanted to change the font.
Nevertheless, the `<font>` tag made its way to the HTML 3.2 standard,
and though deprecated, is still a part of standard HTML.

So when the W3C released the CSS1 standard at the end of 1996,
there was an expectation that both publishers and consumers would have
control over presentation.
In addition, Netscape was pushing to add more presentation elements to HTML
to fend off pressure from Adobe's PDF.
But the W3C, led Tim Berners-Lee, were insistent
that presentation remain separate from content,
and later HTML standards would not allow any more elements like
`<center>` and `<font>`.
How was CSS going to satisfy these conflicting requirements?

The answer was the cascade.

> Cascading allows several style sheets to
> influence the presentation of a document
>
> — Håkon Wium Lie,
> in [his thesis dissertation](https://www.wiumlie.no/2006/phd/css.pdf)

The solution was to allow CSS stylesheets to come from multiple sources.
They could be embedded in the HTML page using a `<style>` element.
Stylesheets served as separate files can be linked to multiple HTML pages on
the same site.
Users could also provide a stylesheet, either generally, or per-site.
And browser vendors would still provide the base styling for every element,
also expressible as CSS rules.

We've already seen how conflicts arise between rules in a stylesheet.
When rules are coming from multiple stylesheets, developed independently
by people with different, or even competing, motivations, conflicts
become inevitable.
The cascade provides a mechanism for deciding how conflicts between
stylesheets are resolved.

Today, user stylesheets are not very commonly used or well supported,
despite the improvements they can make to accessibility.
Browser stylesheets have been fairly standardized, and many sites
apply a _reset_ to reduce dependency on browser styles anyway.
So do we still need the cascade even though 99.9% of the styles
are written by the developers or under their control?

The answer is yes. And the reason is _scaling_.
Very rarely does one developer write _all_ the CSS for a web site.
And even then, they don't write it at all at once, and it's
never all in their head at the same time.
In reality, CSS is written and modified by many people over
years and years.
And in the era of Open-Source Software, CSS can be coming
from developers who never worked on our project at all.

Furthermore, most conflicts cannot be found by analyzing the CSS.
They occur when an HTML element matches multiple rules which have conflicting declarations.
We could find all potentially conflicting rules in any set of CSS files,
but this would be useless, because most of those conflicts will never happen.
Most conflicting scenarios are never encountered, because the rules that are in
conflict were not intended to be applied together.
Those combinations don't do anything useful, so they aren't used.

Which leads us to a strategy for how we can manage conflicts within our
own CSS code.
If we can describe which combinations of rules are intended,
and make sure that those don't have conflicts,
then we have reduced the problem immensely.

Maybe then we wouldn't even need the cascade.
Unless, of course, the cascade can help us work with
sorting through various combinations of rules.

Which, it can. Because the cascade gives us _specificity_.
