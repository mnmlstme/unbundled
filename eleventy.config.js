const kram11ty = require("@cre.ative/kram-11ty");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/scripts": "_scripts",
    "src/styles": "_styles",
  });
  eleventyConfig.addPassthroughCopy("src/chapters/**/_files/*.*");

  eleventyConfig.addPlugin(pluginWebc, {
    // (The default changed from `false` in Eleventy WebC v0.7.0)
    components: "src/components/cre-ative/*.webc",

    // Adds an Eleventy WebC transform to process all HTML output
    useTransform: true,

    // Additional global data used in the Eleventy WebC transform
    transformData: {},
  });

  // Override Markdown parser to Kram
  eleventyConfig.addExtension("md", kram11ty.configure());

  // Transform for running our Kram output through WebC
  false &&
    eleventyConfig.addTransform("webc-html", async function (content) {
      const { WebC } = await import("@11ty/webc");

      if (
        this.page.inputPath.endsWith(".md") &&
        this.page.outputPath &&
        this.page.outputPath.endsWith(".html")
      ) {
        console.log("Transforming WebC to HTML:", this.page.outputPath);

        const page = new WebC();
        const outputDir = path.dirname(this.page.outputPath);

        page.defineComponents("src/components/cre-ative/*.webc");
        page.setBundlerMode(true);
        page.setContent(content);

        const { html, css, js, svg, components } = await page.compile();
        let dependencies = [];

        await fs.mkdir(outputDir, { recursive: true });

        if (css) {
          const cssOutputPath = path.join(outputDir, "styles.css");
          console.log(`Writing ${cssOutputPath}`);
          await fs.writeFile(cssOutputPath, css.join("\n"));
          dependencies.push(cssOutputPath);
        }

        if (js) {
          const jsOutputPath = path.join(outputDir, "script.js");
          console.log(`Writing ${jsOutputPath}`);
          await fs.writeFile(jsOutputPath, js.join("\n"));
          dependencies.push(jsOutputPath);
        }

        // this.addDependencies(this.page.inputPath, dependencies);

        return html;
      }

      return content;
    });

  // Return your Object options:
  return {
    dir: {
      input: "src/chapters",
      output: "site",
    },
  };
};
