import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  mode: "development",
  build: {
    minify: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        effects: resolve(__dirname, "src/effects/index.ts"),
        html: resolve(__dirname, "src/html/index.ts"),
        context: resolve(__dirname, "src/context/index.ts")
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ]
});
