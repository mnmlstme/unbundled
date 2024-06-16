import { _ as __vitePreload } from './preload-helper-8d4f36c2.js';
import { i as init, r as register } from './runtime-68df30c6.js';

init({});
__vitePreload(() => import('./templates.html-e21b022d.js'),true?[]:void 0)
          .then((mod) => register(mod, "templates.html.js", "html", (resource, container) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(resource.default, 'text/html');
            const body = doc.body;
            for ( let def = body.firstElementChild; def; def=body.firstElementChild ) {
              container.appendChild(def); }
          }));
__vitePreload(() => import('./scenes.html-ac3f74c9.js'),true?[]:void 0)
          .then((mod) => register(mod, "scenes.html.js", "html", (resource, container) => {
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
__vitePreload(() => import('./styles.css-8e12e008.js'),true?[]:void 0)
          .then((mod) => register(mod, "styles.css.js", "css", (resource, container) => {
          let sheet = document.createElement("style");
          sheet.innerHTML = resource.default;
          container.appendChild(sheet);
        }));
__vitePreload(() => import('./module-3a40ed63.js'),true?[]:void 0)
          .then((mod) => register(mod, "Kram_4f44e823_webc", "js", null));
