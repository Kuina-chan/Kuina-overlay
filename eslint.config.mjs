import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["node_modules/*"],
}, ...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
        },

        ecmaVersion: 2015,
        sourceType: "module",
    },

    rules: {
        "no-undef": "error",
        "no-extra-semi": "off",
        "no-constant-condition": "off",
        "no-useless-escape": "off",
    },
}];