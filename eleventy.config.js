const kram11ty = require("@cre.ative/kram-11ty");
const vitePlugin = require("@11ty/eleventy-plugin-vite");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/scripts": "scripts",
    "src/styles": "styles",
  });

  eleventyConfig.addPassthroughCopy("src/chapters/**/FILES/*.*");

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
      input: "./src/blog",
      output: "./docs",
      template: "/src/templates/blog.html",
    })
  );

  // Return your Object options:
  return {
    dir: {
      input: "src/blog",
      output: "docs",
    },
  };
};
