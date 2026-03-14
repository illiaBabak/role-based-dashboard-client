import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  envPrefix: "ENV_",
  server: {
    host: true,
    port: 3000,
  },
  plugins: [react(), checker({ typescript: true })],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
