module.exports = {
  plugins: ["stylelint-scss"],
  extends: [
    // "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-prettier/recommended",
  ],
  ignoreFiles: ["node_modules/**", "dist/**/*.css", "assets/css/libs/*.css"],
  rules: {
    "no-descending-specificity": null,
  },
};
