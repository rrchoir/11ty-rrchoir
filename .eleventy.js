const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const {inspect} = require("node:util");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("inspect", (obj) => {
    return inspect(obj, { sorted: true }); // 'sorted: true' makes the output more readable
  });

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
  // layout aliases! Say you have a bunch of existing content using
  // layout: post. If you don’t want to rewrite all of those values, just map
  // post to a new file like this:
  // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Add support for maintenance-free post authors
  // Adds an authors collection using the author key in our post frontmatter
  // Thanks to @pdehaan: https://github.com/pdehaan
  eleventyConfig.addCollection("authors", collection => {
    const blogs = collection.getFilteredByGlob("posts/*.md");
    return blogs.reduce((coll, post) => {
      const author = post.data.author;
      if (!author) {
        return coll;
      }
      if (!coll.hasOwnProperty(author)) {
        coll[author] = [];
      }
      coll[author].push(post.data);
      return coll;
    }, {});
  });

  eleventyConfig.addCollection("events", collection => {
    const events = collection.getFilteredByGlob("events/*.md");
    // The following three lines don't do anything, I think, and could by removed
    return events.reduce((coll, event) => {
      return coll;
    }, {});
  });

  eleventyConfig.addCollection("future_events", function(collectionApi) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of today
    
    return collectionApi.getFilteredByGlob("events/*.md")
      .filter(item => item.data.tags && item.data.tags.includes("event"))
      .filter(item => item.data.start_date)
      .filter(item => {
        const eventDate = new Date(item.data.start_date);
        return eventDate >= now; // Only future/today events
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.start_date);
        const dateB = new Date(b.data.start_date);
        return dateA - dateB;
      });
  });

  eleventyConfig.addCollection("evergreen_events", function(collectionApi) {
    return collectionApi.getFilteredByGlob("events/*.md")
      .filter(item => item.data.tags && item.data.tags.includes("event"))
      .filter(item => !item.data.start_date);
  });

 
  eleventyConfig.addCollection("categories", collection => {
    const songs = collection.getFilteredByGlob("songs/*.md");
    return songs.reduce((collx, song) => {
      const category = song.data.category;
      if (!category) {
        return collx;
      }
      if (!collx.hasOwnProperty(category)) {
        collx[category] = [];
      }
      collx[category].push(song.data);
      return collx;
    }, {});
  });

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("readableDateTime", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("hh:mm, dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/img");
  eleventyConfig.addPassthroughCopy("admin/");
  // We additionally output a copy of our CSS for use in Decap CMS previews
  eleventyConfig.addPassthroughCopy("_includes/assets/css/inline.css");



  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    breaks: true,
    linkify: true,
    html: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  // Claude suggested this solution for two-column songs:
  eleventyConfig.addPairedShortcode("twoColumnTable", function(content) {
    const md = new markdownIt({ html: true });

    // Split content by a delimiter like "---COLUMN---"
    const columns = content.split('---COLUMN---');

    // Render each column's markdown
    const col1 = md.render(columns[0].trim());
    const col2 = columns[1] ? md.render(columns[1].trim()) : '';
    
    return `<table>
      <tr><td style="vertical-align: top">${col1}</td>
      <td style="vertical-align: top; padding-left: 1rem;">${col2}</td>
      </tr></table>`;
  });

  return {
    templateFormats: ["md", "njk", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
