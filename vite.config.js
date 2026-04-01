/// <reference types="vitest/config" />

import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: "src/dual-listbox.js",
            formats: ["es", "cjs"],
            fileName: "dual-listbox",
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            output: {
                exports: "named",
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            exclude: [
                "tests",
                "dist",
                "coverage/**",
                "src/*.test.js",
                "**/*.d.ts",
                "*.config.*",
                "**/{ava,babel,nyc}.config.{js,cjs,mjs}",
                "**/jest.config.{js,cjs,mjs,ts}",
                "**/{karma,rollup,webpack}.config.js",
                "**/.{eslint,mocha}rc.{js,cjs}",
            ],
        },
    },
});
