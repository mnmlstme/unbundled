// vite.config.js
import { defineConfig } from "file:///Users/kenkubiak/Projects/unbundled/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import dts from "file:///Users/kenkubiak/Projects/unbundled/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/kenkubiak/Projects/unbundled/packages/un-bundled";
var vite_config_default = defineConfig({
  mode: "development",
  build: {
    minify: false,
    lib: {
      entry: {
        index: resolve(__vite_injected_original_dirname, "src/index.ts"),
        effects: resolve(__vite_injected_original_dirname, "src/effects/index.ts"),
        html: resolve(__vite_injected_original_dirname, "src/html/index.ts"),
        context: resolve(__vite_injected_original_dirname, "src/context/index.ts")
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva2Vua3ViaWFrL1Byb2plY3RzL3VuYnVuZGxlZC9wYWNrYWdlcy91bi1idW5kbGVkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMva2Vua3ViaWFrL1Byb2plY3RzL3VuYnVuZGxlZC9wYWNrYWdlcy91bi1idW5kbGVkL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9rZW5rdWJpYWsvUHJvamVjdHMvdW5idW5kbGVkL3BhY2thZ2VzL3VuLWJ1bmRsZWQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgbW9kZTogXCJkZXZlbG9wbWVudFwiLFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeToge1xuICAgICAgICBpbmRleDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxuICAgICAgICBlZmZlY3RzOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvZWZmZWN0cy9pbmRleC50c1wiKSxcbiAgICAgICAgaHRtbDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2h0bWwvaW5kZXgudHNcIiksXG4gICAgICAgIGNvbnRleHQ6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jb250ZXh0L2luZGV4LnRzXCIpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICByb2xsdXBUeXBlczogdHJ1ZVxuICAgIH0pXG4gIF1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VixTQUFTLG9CQUFvQjtBQUNwWCxTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBRmhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMLE9BQU8sUUFBUSxrQ0FBVyxjQUFjO0FBQUEsUUFDeEMsU0FBUyxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBLFFBQ2xELE1BQU0sUUFBUSxrQ0FBVyxtQkFBbUI7QUFBQSxRQUM1QyxTQUFTLFFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDcEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsTUFDbEIsYUFBYTtBQUFBLElBQ2YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
