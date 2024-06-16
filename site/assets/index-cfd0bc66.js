import { _ as __vitePreload } from './preload-helper-8d4f36c2.js';
import { i as init, r as register } from './runtime-68df30c6.js';

init({});
__vitePreload(() => import('./scenes.html-e1cf7989.js'),true?[]:void 0)
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
__vitePreload(() => import('./module-d401c2e9.js'),true?[]:void 0)
          .then((mod) => register(mod, "Kram_986b7f8f_classes", "js", null));
