const kram11ty = require("@cre.ative/kram-11ty");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addTemplateFormats("kr");

  // Creates the extension for use
  eleventyConfig.addExtension("kr", kram11ty.configure());

  eleventyConfig.addTransform("webc-html", async function (content) {
    const { WebC } = await import("@11ty/webc");

    if (
      this.page.inputPath.endsWith(".kr") &&
      this.page.outputPath &&
      this.page.outputPath.endsWith(".html")
    ) {
      console.log("Transforming WebC to HTML:", this.page.outputPath);

      const page = new WebC();
      const outputDir = path.dirname(this.page.outputPath);

      page.defineComponents("components/cre-ative/*.webc");
      page.setBundlerMode(true);
      page.setContent(content);

      const { html, css, js, components } = await page.compile();

      if (css) {
        const cssOutputPath = path.join(outputDir, "styles.css");
        console.log(`Writing ${cssOutputPath}`);
        fs.writeFile(cssOutputPath, css.join("\n"));
      }

      if (js) {
        const jsOutputPath = path.join(outputDir, "script.js");
        console.log(`Writing ${jsOutputPath}`);
        fs.writeFile(jsOutputPath, js.join("\n"));
      }

      return html;
    }

    return content;
  });

  // Return your Object options:
  return {
    dir: {
      input: "projects",
      output: "site",
    },
  };
};
