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
    ignores: ["**/dist", "**/node_modules", "packages/iles/turbo.js", "docs/cypress"],
}, ...compat.extends("@mussi/eslint-config"), {
    languageOptions: {
        globals: {
            $ref: "readonly",
            $computed: "readonly",
            $shallowRef: "readonly",
            $$: "readonly",
            $: "readonly",
            usePage: "readonly",
            useRoute: "readonly",
            useHead: "readonly",
            definePageComponent: "readonly",
        },
    },

    rules: {
        "prefer-const": "off",
        "no-unused-vars": "off",
        "import/named": "off",
        "import/first": "off",
        "no-restricted-syntax": "off",
        "no-use-before-define": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "off",

        "vue/attribute-hyphenation": ["warn", "never", {
            ignore: ["http-equiv"],
        }],
    },
}];