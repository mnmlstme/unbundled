import { defineConfig } from "vite";

const htmlImport = {
  name: "htmlImport",
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path.
   * @returns {{code: string}}
   */
  transform(code, id) {
    // we only want to transform HTML fragments
    if (/^.*\.html$/g.test(id) && !code.startsWith("<!DOCTYPE html>")) {
      code = `export default \`${code}\``;
    }
    return { code };
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
  },

  optimizeDeps: {
    disabled: true,
  },

  plugins: [htmlImport],
});
