export default `<html>
            <body><div data-scene="1"><dd>
  <a
    onclick="loadHTML(
          'destination/venice.html', 
          event.target.closest('dd'))"
  >
    Venice
  </a>
</dd>
</div>
<div data-scene="2"><dl class="itinerary">
  <dd>
    <a href="destination/venice.html">Venice</a>
  </dd>
  <dd>
    <a href="destination/florence.html">Florence</a>
  </dd>
  <dd>
    <a href="destination/rome.html">Rome</a>
  </dd>
</dl>
</div>
<div data-scene="4"><body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label> <input type="checkbox" autocomplete="off" /> Dark mode </label>
  </header>
  …
</body>
</div>
<div data-scene="5"><body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label
      onchange="event.stopPropagation();
        toggleDarkMode(event.target.checked)
      "
    >
      <input type="checkbox" autocomplete="off" /> Dark mode
    </label>
  </header>
</body>
</div>
<div data-scene="7"><body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label
      onchange="event.stopPropagation();
        toggleDarkMode(event.target, event.target.checked)
      "
    >
      <input type="checkbox" autocomplete="off" /> Dark mode
    </label>
  </header>
</body>
</div>
<div data-scene="8"><label
  onchange="relayEvent(
    event, 
    'dark-mode', 
    {checked: event.target.checked})"
>
  <input type="checkbox" autocomplete="off" /> Dark mode
</label>
</div></body>
            </html>`;