const kram11ty = require("@cre.ative/kram-11ty");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
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

  // For gh-pages, which adds the repo name to URL
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Return your Object options:
  return {
    dir: {
      input: "src/chapters",
      output: "docs",
    },
    pathPrefix: "/unbundled/",
  };
};
