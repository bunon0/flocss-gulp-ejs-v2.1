module.exports = {
  printWidth: 90,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  endOfLine: 'lf',
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'avoid',

  overrides: [
    {
      files: ['**/*.css', '**/*.scss', '**/*.html'],
      options: { singleQuote: false },
    },
    {
      files: ['gulpfile.js'],
      options: {
        tabWidth: 2,
        printWidth: 150,
      },
    },
  ],
};
