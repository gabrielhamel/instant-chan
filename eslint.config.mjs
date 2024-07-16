import globals from "globals";
import javascript from "@eslint/js";
import typescript from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/**
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import("@eslint/js")}
 */
export default [
  {
    files: ["**/*.{mjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  javascript.configs.recommended,
  ...typescript.configs.recommended,
  eslintConfigPrettier,
];
