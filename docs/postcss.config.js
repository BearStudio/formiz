/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: [
    './docs/**/*.js',
    './docs/**/*.mdx',
    './src/**/*.js',
    './src/**/tailwind.css',
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    ...process.env.NODE_ENV === 'production'
      ? [purgecss]
      : [],
  ],
};
