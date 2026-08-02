import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "crypto"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
          dest: "static/chunks",
        },
        {
          src: "node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
          dest: "static/chunks",
        },
        {
          src: "node_modules/onnxruntime-web/dist/ort-wasm.wasm",
          dest: "static/chunks",
        },
        {
          src: "node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
          dest: "static/chunks",
        },
        {
          src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
          dest: "static/chunks",
        },
        {
          src: "node_modules/@ricky0123/vad-web/dist/*.onnx",
          dest: "static/chunks",
        },
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "sharp", replacement: path.resolve(__dirname, "src/empty.js") },
      { find: "onnxruntime-node", replacement: path.resolve(__dirname, "src/empty.js") },
    ],
    conditions: ["browser"],
  },
  define: {
    "import.meta.env.VITE_BUILD_ID": JSON.stringify("vite-build"),
  },
  build: {
    outDir: "out",
    assetsDir: "static",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        pet: path.resolve(__dirname, "pet.html"),
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
