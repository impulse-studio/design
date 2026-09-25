//  @ts-check

import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"
import tsParser from "@typescript-eslint/parser"
import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  ...vue.configs["flat/essential"],
  { files: ["renderer/**/*.ts"], languageOptions: { parserOptions: { project: "./renderer/tsconfig.json" } } },
  { ...tseslint.configs.disableTypeChecked, files: ["renderer/**/*.vue"], languageOptions: { parser: vueParser, parserOptions: { parser: tsParser, project: null, extraFileExtensions: [".vue"] } } },
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // Generated shadcn primitives preserve upstream defensive guards and callback names.
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "no-shadow": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
  },
  {
    ignores: [
      "eslint.config.js",
      ".prettierrc",
      "dist/**",
      ".output/**",
      ".nitro/**",
      "public/renderer/**",
      "renderer/vendor/**",
      "renderer/src/back/**",
      "renderer/src/registry.generated.ts",
      "src/generated/**",
    ],
  },
]
