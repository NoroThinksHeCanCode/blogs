module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: ".",
      output: "_site"
    },
    pathPrefix: "/blogs/"
  };
};
