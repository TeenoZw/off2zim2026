module.exports = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-config-tailwindcss"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "config",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme", "screen"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["font-feature-settings", "text-wrap"],
      },
    ],
  },
};
