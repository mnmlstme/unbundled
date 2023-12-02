/* empty css                 */import { i as init, r as register } from './runtime-3d036b5f.js';

init({});
import('./templates.html-3559f236.js')
          .then((mod) => register(mod, "undefined", "html", (resource, container) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(resource.default, 'text/html');
            const body = doc.body;
            for ( let def = body.firstElementChild; def; def=body.firstElementChild ) {
              container.appendChild(def); }
          }));
import('./scenes.html-343fb5d5.js')
          .then((mod) => register(mod, "undefined", "html", (resource, container) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(resource.default, 'text/html');
            const body = doc.body;
            const scenes = Object.fromEntries(
              Array.prototype.map.call(body.children, (node) => [
              node && node.dataset.scene, node ])
              .filter(([num]) => Boolean(num)));
            return function render (n, container) {
              const scene = scenes[n];
              if( scene ) {
                for( let child = scene.firstElementChild; child; child = scene.firstElementChild ) {
                  if ( child.tagName === 'SCRIPT' ) {
                    const text = child.firstChild;
                    scene.removeChild(child);
                    child = document.createElement('script');
                    child.appendChild(text);
                  } 
                  container.appendChild(child); 
                }
              } 
            }
          }));
import('./styles.css-99995e38.js')
          .then((mod) => register(mod, "undefined", "css", (resource, container) => {
          let sheet = document.createElement("style");
          sheet.innerHTML = resource.default;
          container.appendChild(sheet);
        }));
import('./module-9ff3e8ac.js')
          .then((mod) => register(mod, "Kram_a9f90145_itinerary", "js", function(resource, container, initial) {
      if ( typeof (resource && resource.mount) === 'function' ) {
        return resource.mount(container, initial)
      }}));
