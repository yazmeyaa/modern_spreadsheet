import { defineConfig } from 'vite'
import path from 'path'
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";


export default defineConfig({
    base: '/modern_spreadsheet/',
    plugins: [],
    resolve: {},
    server: {
        port: 3000
    },
    build: {
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            fileName: "main",
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: [],
            plugins: [
                typescriptPaths({
                    preserveExtensions: true
                }),
                typescript({
                    sourceMap: false,
                    declaration: true,
                    outDir: 'dist'
                })
            ]
        }
    }
})