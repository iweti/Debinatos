import tsParser from "@typescript-eslint/parser";
import tailwind from "eslint-plugin-better-tailwindcss";

// npx eslint src --fix
// Ajusta class names de tailwind usando canonical class names.

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "better-tailwindcss": tailwind,
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/globals.css",
      },
    },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": [
        "warn",
        { rootFontSize: 16 },
      ],
    },
  },
];
