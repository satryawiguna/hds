import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "node_modules",
      "dist",
      ".next",
      "out",
      "build",
      "coverage",
      ".turbo",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
