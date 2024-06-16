const kram11ty = require("@cre.ative/kram-11ty");
const vitePlugin = require("@11ty/eleventy-plugin-vite");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "blog/scripts": "scripts",
    "blog/styles": "styles",
  });

  eleventyConfig.addPassthroughCopy("blog/**/FILES/*.*");

  eleventyConfig.addPlugin(vitePlugin, {
    viteOptions: {
      mode: "development",
      build: {
        modulePreload: false,
        minify: false,
        target: "esnext",
      },
    },
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  // Override Markdown parser to Kram
  eleventyConfig.addExtension(
    "md",
    kram11ty.configure({
      input: "./blog",
      output: "./site",
      template: "./templates/blog.html",
    })
  );

  // Return your Object options:
  return {
    dir: {
      input: "./blog",
      output: "./site",
    },
  };
};
