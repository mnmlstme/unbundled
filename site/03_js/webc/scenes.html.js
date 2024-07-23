export default `<html>
            <body><div data-scene="1"><hello-world></hello-world>
</div>
<div data-scene="2"><hello-name name="Blaze"></hello-name>
</div>
<div data-scene="3"><hello-content>
  <img src="../FILES/Globe.svg" />
  World
</hello-content>
</div>
<div data-scene="4"><hello-style>
  <img src="../FILES/Globe.svg" />
  World
</hello-style>
</div>
<div data-scene="5"><greet-world>
  <span slot="greeting">Greetings</span>
  <img src="../FILES/Globe.svg" />
  Earthlings
</greet-world>
</div>
<div data-scene="6"><arrow-button></arrow-button>
<arrow-button heading="90deg"></arrow-button>
<arrow-button heading="180deg"></arrow-button>
<arrow-button heading="-90deg"></arrow-button>
<arrow-button heading="45deg"></arrow-button>
</div>
<div data-scene="7"><section>
  <nav class="menu-bar">
    <drop-down>
      <span slot="actuator">File</span>
      <menu>
        <li>New…</li>
        <li><hr /></li>
        <li>Open…</li>
        <li>Open Recent</li>
        <li><hr /></li>
        <li>Save</li>
        <li>Save As…</li>
        <li>Revert to Last Saved</li>
        <li><hr /></li>
        <li>Close</li>
      </menu>
    </drop-down>
    <drop-down><span slot="actuator"> Edit </span></drop-down>
    <drop-down><span slot="actuator"> View </span></drop-down>
    <drop-down><span slot="actuator"> Help </span></drop-down>
  </nav>
</section>
</div>
<div data-scene="9"><section>
  <nav class="menu-bar">
    <dropdown-base>
      File
      <command-menu slot="layer">
        <action-item>New…</action-item>
        <command-group>
          <action-item>Open…</action-item>
          <action-item>Open Recent</action-item>
        </command-group>
        <command-group>
          <action-item>Save</action-item>
          <action-item>Save As…</action-item>
          <action-item>Revert to Last Saved</action-item>
        </command-group>
        <action-item>Close</action-item>
      </command-menu>
    </dropdown-base>
    <dropdown-base>Edit</dropdown-base>
    <dropdown-base>View</dropdown-base>
    <dropdown-base>Help</dropdown-base>
  </nav>
</section>
</div>
<div data-scene="11"><format-data name="count">The count is {count}.</format-data>
<action-item>↑</action-item>
<action-item>↓</action-item>
<action-item>Reset</action-item>
</div>
<div data-scene="12"><html-fragment href="destination/venice.html">
  <h3>
    <a href="#" onclick="relayEvent(event, 'html-fragment:open')"> Venice </a>
  </h3>
</html-fragment>
</div></body>
            </html>`;