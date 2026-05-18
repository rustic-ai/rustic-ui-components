import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import cypress from "eslint-plugin-cypress";
import muiPathImports from "eslint-plugin-mui-path-imports";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ['**/jest.config.js', '**/webpack.config.js', '**/webpack.prod.config.js'],
}, ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'prettier',
), cypress.configs.recommended, {
    plugins: {
        "unused-imports": unusedImports,
        "@typescript-eslint": typescriptEslint,
        "simple-import-sort": simpleImportSort,
        "mui-path-imports": muiPathImports,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: true,
        },
    },

    rules: {
        "no-unused-vars": "off",

        "no-console": ["error", {
            allow: ["warn", "error"],
        }],

        "no-magic-numbers": ["error", {
            ignore: [-1, 0, 1],
        }],

        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "unused-imports/no-unused-imports": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        curly: "error",
        "mui-path-imports/mui-path-imports": "error",
    },
}];