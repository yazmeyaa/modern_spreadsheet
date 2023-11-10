import { defineConfig } from "vite";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

const BROWSER_MODE = process.env.BUILD_BROWSER === 'true';
console.log({ BROWSER_MODE });

const libConfig = defineConfig({
  base: "/modern_spreadsheet/",
  plugins: [],
  resolve: {},
  server: {
    port: 5179,
    open: true,
  },
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      fileName: "main",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["./src/index.ts"],
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ],
    },
  },
});

const browserConfig = defineConfig({
  base: "/modern_spreadsheet/",
  resolve: {},
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'index.html'),
      fileName: 'demo',
      formats: ['es']
    }
  }
})

const config = BROWSER_MODE ? browserConfig : libConfig;

export default config;
