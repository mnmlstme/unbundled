// ES6 module
let registry = {};

export function register(name, module) {
  registry[name] = module;
  console.log(`Operative module ${name} registered.`);
}

export function mount(name, mountpoint, initial) {
  const module = registry[name];
  let render = (n, container) => {
    console.log("Cannot render scene; Operative module not mounted.");
  };

  try {
    render = module.mount(mountpoint, initial);
    console.log(`Operative module ${name} mounted.`);
  } catch (err) {
    console.log(`Warning: Not able to mount Operative module "${name}:`, err);
  }

  return render;
}
