// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * ESLint v9 flat config:
 * - JavaScript recommended rules
 * - TypeScript recommended rules (via typescript-eslint v8)
 * - Prettier disables conflicting stylistic rules
 */
export default [
  js.configs.recommended,
  // TS presets (includes parser+plugin wired for flat config)
  ...tseslint.configs.recommended,
  // Optional project-wide rules/overrides
  {
    rules: {
      // add repo-specific rules here, e.g.:
      // "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  // Turn off stylistic rules conflicting with Prettier
  prettier,
];
