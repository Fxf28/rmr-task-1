import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        report: "study-abroad-report.html",
        behaviour: "behaviour-report.html",
      },
    },
  },
});
