const scenes_html = `<html>
            <body><div data-scene="1"><p>
  <button
    onclick="addText(
        'Hello, world! ',
        event.target.closest('p'))"
  >
    Say it!
  </button>
</p>
</div>
<div data-scene="2"><section>
  <button
    onclick="addParagraph(
        'Hello, world!',
        event.target.closest('section'))"
  >
    Say it!
  </button>
</section>
</div>
<div data-scene="3"><section>
  <button
    onclick="addFragment(
        '<h1>Hello, <em>world!</em></h1>How do you do?',
        event.target.closest('section'))"
  >
    Say it with HTML!
  </button>
</section>
</div>
<div data-scene="4"><pre>
    <code>
        <button onclick="addTextFrom(
            '../FILES/metamorphosis.html',
            event.target.closest('code')
            )"
        > Fetch It! </button>
    </code>
</pre>
</div>
<div data-scene="5"><article>
  <button
    onclick="addFragmentFrom(
        '../FILES/metamorphosis.html',
        event.target.closest('article')
        )"
  >
    Fetch the HTML!
  </button>
</article>
</div></body>
            </html>`;

export { scenes_html as default };
