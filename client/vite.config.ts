import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../static",
    emptyOutDir: true,
    target: "es2022",
  },
  server: {
    host: true,
    proxy: {
      "/ws": {
        target: "ws://localhost:8080",
        ws: true,
      },
    },
  },
});
