export default `<html>
            <body><div data-scene="1"><h1>Selected by element type</h1>

<h1 class="fancy">Selected by class name</h1>

<h1 id="Chapter01">Selected by ID</h1>
</div>
<div data-scene="2"><h1>Element Type (&amp; Browser default)</h1>

<h1 class="fancy">Class &amp; Element</h1>

<h1 class="fancy" id="Chapter01">ID &amp; Class &amp; Element</h1>

<h1 class="fancy" id="Chapter01" style="font: italic 16px monospace">
  Inline &amp; ID &amp; Class &gt; Element
</h1>
</div>
<div data-scene="3"><h1>Just an H1</h1>
<h2>Just an H2</h2>
<hr />
<h1 class="fancy">The fancy H1 we want</h1>
<h2 class="fancy2">The fancy H2 we want</h2>

<hr />
<h2 class="fancy">Fancy H1 ok, but breaks fancy H2</h2>
<h1 class="fancy2">Fancy H2 ok, but breaks fancy H1</h1>
</div>
<div data-scene="4"><h1 class="schmancy">This is a schmancy H1</h1>

<h2 class="schmancy">This is a schmancy H2</h2>

<p class="schmancy">
  For any other schmancy element, we get some basic fanciness.
</p>

<h1 class="schmancy" id="Chapter01">The ID rule still works with schmancy</h1>
</div>
<div data-scene="5"><h2>Just the H2 styles</h2>

<p class="schmancy">Just the schmancy styles</p>

<h2 class="schmancy">The H2 and shmancy styles</h2>
</div></body>
            </html>`;